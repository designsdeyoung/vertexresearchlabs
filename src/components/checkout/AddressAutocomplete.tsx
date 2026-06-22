import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY || "";

interface AddressParts {
  address1: string;
  city: string;
  state: string;
  zip: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (parts: AddressParts) => void;
  placeholder?: string;
  className?: string;
}

let scriptLoaded = false;
let scriptLoading = false;
const callbacks: (() => void)[] = [];

function loadGooglePlaces(cb: () => void) {
  if (scriptLoaded) { cb(); return; }
  callbacks.push(cb);
  if (scriptLoading) return;
  scriptLoading = true;
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
  script.async = true;
  script.onload = () => {
    scriptLoaded = true;
    callbacks.forEach((fn) => fn());
    callbacks.length = 0;
  };
  document.head.appendChild(script);
}

export default function AddressAutocomplete({ value, onChange, onAddressSelect, placeholder, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [ready, setReady] = useState(scriptLoaded);

  useEffect(() => {
    loadGooglePlaces(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current || autocompleteRef.current) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "us" },
      fields: ["address_components"],
      types: ["address"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place.address_components) return;

      let streetNumber = "";
      let route = "";
      let city = "";
      let state = "";
      let zip = "";

      for (const comp of place.address_components) {
        const types = comp.types;
        if (types.includes("street_number")) streetNumber = comp.long_name;
        else if (types.includes("route")) route = comp.short_name;
        else if (types.includes("locality")) city = comp.long_name;
        else if (types.includes("administrative_area_level_1")) state = comp.short_name;
        else if (types.includes("postal_code")) zip = comp.long_name;
      }

      const address1 = [streetNumber, route].filter(Boolean).join(" ");
      onChange(address1);
      onAddressSelect({ address1, city, state, zip });
    });

    autocompleteRef.current = ac;
  }, [ready]);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Start typing your address..."}
      className={className}
      autoComplete="off"
    />
  );
}
