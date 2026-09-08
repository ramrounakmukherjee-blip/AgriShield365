import re
from pathlib import Path
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import config

# Map KB file stems to actual product names
_PRODUCT_FILE_MAP = {
    "databridge-pro": "DataBridge Pro",
    "cloudsync": "CloudSync",
    "analyticshub": "AnalyticsHub",
    "securevault": "SecureVault",
    "workflowengine": "WorkflowEngine",
}

class KBChunk(BaseModel):
    """A chunk of knowledge base content with metadata."""
    content: str
    source_file: str
    section_title: str
    product: str | None = None

class KBRetriever:
    """TF-IDF based knowledge base retrieval."""
    
    def __init__(self, kb_dir: str = None):
        project_root = Path(__file__).resolve().parent.parent
        self.kb_dir = kb_dir or str(project_root / "knowledge-base")
        self.chunks: list[KBChunk] = []
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=5000, stop_words='english')
        self.tfidf_matrix = None
        self._load_and_chunk_kb()
        
    def _load_and_chunk_kb(self):
        kb_path = Path(self.kb_dir)
        if not kb_path.exists():
            return
            
        for md_file in kb_path.rglob("*.md"):
            rel_path = md_file.relative_to(kb_path).as_posix()
            
            # Extract product name from file stem using the mapping
            product_name = _PRODUCT_FILE_MAP.get(md_file.stem)
                
            content = md_file.read_text(encoding='utf-8')
            raw_chunks = content.split('\n---\n')
            
            for chunk_content in raw_chunks:
                chunk_content = chunk_content.strip()
                if not chunk_content:
                    continue
                    
                # Extract heading
                section_title = "Unknown Section"
                heading_match = re.search(r'^(?:#|##)\s+(.+)$', chunk_content, re.MULTILINE)
                if heading_match:
                    section_title = heading_match.group(1).strip()
                    
                # If product name isn't in path, maybe it's in the title
                chunk_product = product_name
                if not chunk_product and "Product:" in chunk_content:
                    # Simple heuristic
                    prod_match = re.search(r'Product:\s*(.+)', chunk_content, re.IGNORECASE)
                    if prod_match:
                        chunk_product = prod_match.group(1).strip()
                
                self.chunks.append(KBChunk(
                    content=chunk_content,
                    source_file=rel_path,
                    section_title=section_title,
                    product=chunk_product
                ))
                
        if self.chunks:
            contents = [c.content for c in self.chunks]
            self.tfidf_matrix = self.vectorizer.fit_transform(contents)
            
    def retrieve(self, query: str, top_k: int = 3, min_similarity: float = 0.05) -> list[KBChunk]:
        """Retrieve the top-k most relevant KB chunks for a query."""
        if not self.chunks or self.tfidf_matrix is None:
            return []
            
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix)[0]
        
        # Get indices of chunks with similarity >= min_similarity
        valid_indices = [i for i, sim in enumerate(similarities) if sim >= min_similarity]
        
        # Sort by similarity
        valid_indices.sort(key=lambda i: similarities[i], reverse=True)
        
        top_indices = valid_indices[:top_k]
        return [self.chunks[i] for i in top_indices]
        
    def retrieve_by_error_code(self, error_code: str) -> list[KBChunk]:
        """Direct lookup of chunks containing a specific error code."""
        results = []
        for chunk in self.chunks:
            if error_code in chunk.content:
                results.append(chunk)
        return results
        
    def get_all_chunks(self) -> list[KBChunk]:
        """Return all chunks (for debugging)."""
        return self.chunks
