import { useEffect, useRef, useState } from "react";
import { MapPin, LocateFixed, Loader2, Search, X } from "lucide-react";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function LocationPicker({
  value = "",
  onChange,
  coordinates = null,
  onCoordinatesChange,
  placeholder = "Search campus, area, street or location",
  required = false,
  showMap = true,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const searchTimeoutRef = useRef(null);

  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState("");

  const [selectedCoordinates, setSelectedCoordinates] = useState(
    coordinates ?
      {
        lng: Number(coordinates.lng),
        lat: Number(coordinates.lat),
      }
    : null,
  );

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    if (coordinates?.lng !== undefined && coordinates?.lat !== undefined) {
      setSelectedCoordinates({
        lng: Number(coordinates.lng),
        lat: Number(coordinates.lat),
      });
    }
  }, [coordinates]);

  // Initialize Mapbox
  useEffect(() => {
    if (!showMap || !mapContainerRef.current || mapRef.current) {
      return;
    }

    if (!MAPBOX_TOKEN) {
      setError("Mapbox token is missing.");
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const initialCenter =
      selectedCoordinates ?
        [selectedCoordinates.lng, selectedCoordinates.lat]
      : [88.3966, 22.6613];

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialCenter,
      zoom: selectedCoordinates ? 15 : 11,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current.on("load", () => {
      setMapReady(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showMap]);

  // Update map marker
  useEffect(() => {
    if (!mapReady || !mapRef.current || !selectedCoordinates) {
      return;
    }

    const lngLat = [selectedCoordinates.lng, selectedCoordinates.lat];

    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker({
        color: "#2563eb",
      })
        .setLngLat(lngLat)
        .addTo(mapRef.current);
    } else {
      markerRef.current.setLngLat(lngLat);
    }

    mapRef.current.flyTo({
      center: lngLat,
      zoom: 16,
      essential: true,
    });
  }, [selectedCoordinates, mapReady]);

  // Mapbox search
  const searchLocations = async (searchText) => {
    const text = searchText.trim();

    if (!text || text.length < 3) {
      setSuggestions([]);
      return;
    }

    if (!MAPBOX_TOKEN) {
      setError("Mapbox token is missing.");
      return;
    }

    try {
      setSearching(true);
      setError("");

      const url =
        `https://api.mapbox.com/search/geocode/v6/forward` +
        `?q=${encodeURIComponent(text)}` +
        `&autocomplete=true` +
        `&limit=5` +
        `&country=IN` +
        `&language=en` +
        `&access_token=${MAPBOX_TOKEN}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to search location.");
      }

      const data = await response.json();

      setSuggestions(data.features || []);
    } catch (searchError) {
      console.error("Location Search Error:", searchError);

      setSuggestions([]);
      setError("Unable to search this location.");
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;

    setQuery(text);

    onChange?.(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(text);
    }, 450);
  };

  const selectSuggestion = (feature) => {
    const coordinatesFromMapbox = feature.geometry?.coordinates;

    if (!coordinatesFromMapbox) {
      return;
    }

    const [lng, lat] = coordinatesFromMapbox;

    const address =
      feature.properties?.full_address ||
      feature.properties?.name ||
      feature.place_name ||
      "";

    setQuery(address);
    setSuggestions([]);
    setError("");

    setSelectedCoordinates({
      lng,
      lat,
    });

    onChange?.(address);

    onCoordinatesChange?.({
      lng,
      lat,
    });
  };

  const reverseGeocode = async (lng, lat) => {
    const url =
      `https://api.mapbox.com/search/geocode/v6/reverse` +
      `?longitude=${lng}` +
      `&latitude=${lat}` +
      `&language=en` +
      `&limit=1` +
      `&access_token=${MAPBOX_TOKEN}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Reverse geocoding failed.");
    }

    const data = await response.json();

    const feature = data.features?.[0];

    return (
      feature?.properties?.full_address ||
      feature?.properties?.name ||
      feature?.place_name ||
      "Current Location"
    );
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Location detection is not supported by this browser.");
      return;
    }

    if (!MAPBOX_TOKEN) {
      setError("Mapbox token is missing.");
      return;
    }

    setDetecting(true);
    setError("");
    setSuggestions([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const address = await reverseGeocode(longitude, latitude);

          const newCoordinates = {
            lng: longitude,
            lat: latitude,
          };

          setQuery(address);
          setSelectedCoordinates(newCoordinates);

          onChange?.(address);
          onCoordinatesChange?.(newCoordinates);
        } catch (locationError) {
          console.error("Current Location Error:", locationError);

          setError("Could not convert your current location into an address.");
        } finally {
          setDetecting(false);
        }
      },
      (geoError) => {
        console.error("Geolocation Error:", geoError);

        setDetecting(false);

        if (geoError.code === 1) {
          setError(
            "Location permission was denied. Please allow location access.",
          );
        } else if (geoError.code === 2) {
          setError("Your current location could not be detected.");
        } else {
          setError("Location detection timed out. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const clearLocation = () => {
    setQuery("");
    setSuggestions([]);
    setSelectedCoordinates(null);

    onChange?.("");
    onCoordinatesChange?.(null);

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Input */}
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400">
          <MapPin size={19} />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-24 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />

        {query && (
          <button
            type="button"
            onClick={clearLocation}
            className="absolute right-14 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Clear location"
          >
            <X size={17} />
          </button>
        )}

        <button
          type="button"
          onClick={detectCurrentLocation}
          disabled={detecting}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          title="Use current location"
          aria-label="Use current location"
        >
          {detecting ?
            <Loader2 size={17} className="animate-spin" />
          : <LocateFixed size={17} />}
        </button>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            {suggestions.map((feature) => (
              <button
                key={feature.id}
                type="button"
                onClick={() => selectSuggestion(feature)}
                className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-blue-50"
              >
                <MapPin size={17} className="mt-0.5 shrink-0 text-blue-600" />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {feature.properties?.name || feature.text || "Location"}
                  </p>

                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                    {feature.properties?.full_address ||
                      feature.place_name ||
                      ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {searching && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 text-blue-500">
            <Loader2 size={17} className="animate-spin" />
          </div>
        )}
      </div>

      {/* Current Location Button */}
      <button
        type="button"
        onClick={detectCurrentLocation}
        disabled={detecting}
        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {detecting ?
          <Loader2 size={16} className="animate-spin" />
        : <LocateFixed size={16} />}

        {detecting ? "Detecting location..." : "Use my current location"}
      </button>

      {/* Coordinates */}
      {selectedCoordinates && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Search size={14} />

            <span>Location coordinates saved</span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            {selectedCoordinates.lat.toFixed(6)},{" "}
            {selectedCoordinates.lng.toFixed(6)}
          </p>
        </div>
      )}

      {/* Map */}
      {showMap && (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div ref={mapContainerRef} className="h-64 w-full" />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default LocationPicker;
