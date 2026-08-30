import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../lib/mapIcons";
import {
  ArrowRight,
  ArrowLeft,
  User,
  MapPin,
  Sprout,
  Settings2,
  LocateFixed,
  CheckCircle2,
  Tractor,
} from "lucide-react";
import { CROPS, SOIL_TYPES, IRRIGATION_TYPES } from "../lib/agri";

const STEPS = [
  { id: "about", label: "About you", icon: User },
  { id: "location", label: "Your farm", icon: MapPin },
  { id: "crop", label: "Your crop", icon: Sprout },
  { id: "details", label: "Farm details", icon: Settings2 },
];

// Keeps the map centred on the chosen point and forwards clicks
function MapController({ lat, lng, onPick }) {
  const map = useMap();
  useMapEvents({
    click(e) {
      if (onPick) onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 11), { animate: true });
  }, [lat, lng, map]);
  return null;
}

function DraggableMarker({ lat, lng, onPick }) {
  return (
    <>
      <MapController lat={lat} lng={lng} onPick={onPick} />
      <Marker
        position={[lat, lng]}
        draggable
        eventHandlers={{
          dragend(e) {
            const { lat, lng } = e.target.getLatLng();
            onPick([lat, lng]);
          },
        }}
      />
    </>
  );
}

function Field({ label, hi, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
        {label} <span className="font-hindi font-semibold normal-case tracking-normal">· {hi}</span>
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-2xl border-2 border-stone-200 focus:border-emerald-500 bg-white px-4 py-3.5 text-lg font-medium text-stone-800 outline-none transition placeholder:text-stone-400 placeholder:font-normal";

export default function Onboarding({ onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState({
    name: "",
    lat: 23.59, // default: central India
    lng: 78.96,
    village: "",
    crop: "rice",
    area: "",
    sowingDate: "",
    soil: SOIL_TYPES[0],
    irrigation: IRRIGATION_TYPES[3],
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const stepValid = useMemo(() => {
    if (stepIdx === 0) return form.name.trim().length >= 2;
    if (stepIdx === 1) return Math.abs(form.lat) > 0 && Math.abs(form.lng) > 0;
    if (stepIdx === 2) return !!form.crop;
    if (stepIdx === 3) return Number(form.area) > 0;
    return true;
  }, [stepIdx, form]);

  const next = () => {
    if (!stepValid) return;
    if (stepIdx < STEPS.length - 1) setStepIdx((i) => i + 1);
    else onComplete(form);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set("lat", pos.coords.latitude);
        set("lng", pos.coords.longitude);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const step = STEPS[stepIdx];

  return (
    <div className="min-h-[100dvh] bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-5 py-4 sticky top-0 z-20">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <img
            src="/assets/logo-agrishield365.jpg"
            alt=""
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div>
            <h1 className="font-extrabold text-stone-800 leading-tight">
              Set up your farm
            </h1>
            <p className="font-hindi text-xs text-emerald-700">
              अपने खेत की जानकारी दें
            </p>
          </div>
        </div>

        {/* Stepper */}
        <div className="max-w-lg mx-auto mt-3 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center gap-1.5">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= stepIdx ? "bg-emerald-500" : "bg-stone-200"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="max-w-lg mx-auto mt-2 text-xs font-semibold text-stone-500">
          Step {stepIdx + 1} of {STEPS.length} · {step.label}
        </p>
      </header>

      {/* Body */}
      <main className="flex-1 w-full max-w-lg mx-auto px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step.id === "about" && (
              <div className="flex flex-col gap-5">
                <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-5">
                  <p className="text-emerald-900 font-semibold">
                    Namaste! 🙏 Let's personalise AgriShield 365 for your fields.
                  </p>
                  <p className="font-hindi text-sm text-emerald-800 mt-1">
                    नमस्ते! आइए, आपके खेत के हिसाब से सलाह तैयार करें।
                  </p>
                </div>

                <Field label="Your name" hi="आपका नाम">
                  <input
                    autoFocus
                    className={inputCls}
                    placeholder="e.g. Ramesh Kumar"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                  />
                </Field>

                <Field label="Village / district (optional)" hi="गाँव / ज़िला">
                  <input
                    className={inputCls}
                    placeholder="e.g. near Nagpur"
                    value={form.village}
                    onChange={(e) => set("village", e.target.value)}
                  />
                </Field>
              </div>
            )}

            {step.id === "location" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-stone-600">
                    Tap the map or drag the pin to your field.{" "}
                    <span className="font-hindi text-stone-500">
                      निशान को अपने खेत पर लाएँ।
                    </span>
                  </p>
                  <button
                    onClick={useMyLocation}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-sm font-bold px-4 py-2.5 hover:bg-emerald-500 active:scale-95 transition shadow"
                  >
                    <LocateFixed className="w-4 h-4" />
                    Use my GPS
                  </button>
                </div>

                <div className="rounded-3xl overflow-hidden border-2 border-stone-200 shadow-sm">
                  <MapContainer
                    center={[form.lat, form.lng]}
                    zoom={11}
                    scrollWheelZoom={false}
                    style={{ height: "300px", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    <DraggableMarker
                      lat={form.lat}
                      lng={form.lng}
                      onPick={([lat, lng]) => {
                        set("lat", lat);
                        set("lng", lng);
                      }}
                    />
                  </MapContainer>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white border border-stone-200 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Latitude
                    </p>
                    <p className="font-bold text-stone-800">{form.lat.toFixed(4)}°</p>
                  </div>
                  <div className="rounded-2xl bg-white border border-stone-200 px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Longitude
                    </p>
                    <p className="font-bold text-stone-800">{form.lng.toFixed(4)}°</p>
                  </div>
                </div>
              </div>
            )}

            {step.id === "crop" && (
              <div className="flex flex-col gap-5">
                <Field label="Which crop is standing in your field?" hi="खेत में कौन सी फसल है?">
                  <div className="grid grid-cols-2 gap-3">
                    {CROPS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => set("crop", c.id)}
                        className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition active:scale-95 ${
                          form.crop === c.id
                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <span className="text-2xl">{c.emoji}</span>
                        <span className="flex flex-col">
                          <span className="font-bold text-stone-800 text-sm">{c.label.split(" / ")[0]}</span>
                          <span className="font-hindi text-xs text-stone-500">{c.hi}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Approximate sowing date (optional)" hi="बुवाई की तारीख">
                  <input
                    type="date"
                    className={inputCls}
                    value={form.sowingDate}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => set("sowingDate", e.target.value)}
                  />
                </Field>
              </div>
            )}

            {step.id === "details" && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Field area" hi="रकबा">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0.1"
                      step="0.1"
                      className={inputCls}
                      placeholder="2.5"
                      value={form.area}
                      onChange={(e) => set("area", e.target.value)}
                    />
                  </Field>
                  <Field label="Unit" hi="इकाई">
                    <select
                      className={inputCls}
                      defaultValue="acres"
                      aria-label="Area unit"
                    >
                      <option value="acres">acres / एकड़</option>
                      <option value="bigha">bigha / बीघा</option>
                      <option value="hectare">hectare / हेक्टेयर</option>
                    </select>
                  </Field>
                </div>

                <Field label="Soil type" hi="मिट्टी का प्रकार">
                  <select
                    className={inputCls}
                    value={form.soil}
                    onChange={(e) => set("soil", e.target.value)}
                  >
                    {SOIL_TYPES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Irrigation method" hi="सिंचाई का तरीका">
                  <select
                    className={inputCls}
                    value={form.irrigation}
                    onChange={(e) => set("irrigation", e.target.value)}
                  >
                    {IRRIGATION_TYPES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>

                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
                  <Tractor className="inline w-4 h-4 mr-1.5 -mt-0.5" />
                  You can change all of this later from your dashboard.{" "}
                  <span className="font-hindi">यह जानकारी बाद में भी बदल सकते हैं।</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer nav */}
      <footer className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-stone-200 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {stepIdx > 0 && (
            <button
              onClick={() => setStepIdx((i) => i - 1)}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-stone-200 px-5 py-3.5 font-bold text-stone-600 hover:bg-stone-50 active:scale-95 transition"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          )}
          <button
            onClick={next}
            disabled={!stepValid}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:bg-stone-300 disabled:cursor-not-allowed transition px-6 py-3.5 text-base sm:text-lg font-bold text-white shadow-lg shadow-emerald-600/25"
          >
            {stepIdx === STEPS.length - 1 ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Show my dashboard
                <span className="font-hindi font-semibold">· डैशबोर्ड खोलें</span>
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
