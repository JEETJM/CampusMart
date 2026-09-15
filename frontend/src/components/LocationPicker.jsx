import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { LocateFixed, Loader2, MapPin, Search, X } from "lucide-react";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || "";

/* =========================================================
   LOCATION PICKER
========================================================= */

function LocationPicker({
  value = "",
  onChange,
  onLocationSelect,
  showMap = true,
  placeholder = "Search location",
}) {
  const mapContainerRef = useRef(null);

  const mapRef = useRef(null);

  const markerRef = useRef(null);

  const searchTimerRef = useRef(null);

  const [query, setQuery] = useState(value || "");

  const [suggestions, setSuggestions] = useState([]);

  const [searching, setSearching] = useState(false);

  const [locating, setLocating] = useState(false);

  const [mapReady, setMapReady] = useState(false);

  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);

  /* =========================================================
     SYNC EXTERNAL VALUE
  ========================================================= */

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  /* =========================================================
     GET THEME
  ========================================================= */

  const getTheme = () => {
    return document.documentElement.classList.contains("dark") ?
        "dark"
      : "light";
  };

  /* =========================================================
     MAP STYLE
  ========================================================= */

  const getMapStyle = () => {
    return getTheme() === "dark" ?
        "mapbox://styles/mapbox/dark-v11"
      : "mapbox://styles/mapbox/streets-v12";
  };

  /* =========================================================
     CREATE MARKER
  ========================================================= */

  const updateMarker = (lng, lat) => {
    if (!mapRef.current) {
      return;
    }

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new mapboxgl.Marker({
      color: "#2563eb",
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
  };

  /* =========================================================
     REVERSE GEOCODE
  ========================================================= */

  const reverseGeocode = async (lng, lat) => {
    if (!mapboxgl.accessToken) {
      throw new Error("Mapbox token is missing.");
    }

    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/` +
      `${lng},${lat}.json` +
      `?access_token=${encodeURIComponent(mapboxgl.accessToken)}` +
      `&language=en` +
      `&country=IN` +
      `&limit=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unable to find this location.");
    }

    const data = await response.json();

    const feature = data.features?.[0];

    if (!feature) {
      throw new Error("No address found for this location.");
    }

    return {
      address: feature.place_name || feature.text || "",

      placeName: feature.text || feature.place_name || "",

      lat,

      lng,
    };
  };

  /* =========================================================
     SELECT LOCATION
  ========================================================= */

  const selectLocation = (location, options = {}) => {
    if (!location) {
      return;
    }

    const { moveMap = true } = options;

    const lat = Number(location.lat ?? location.latitude);

    const lng = Number(location.lng ?? location.longitude);

    const address =
      location.address ||
      location.formattedAddress ||
      location.place_name ||
      location.placeName ||
      "";

    const normalized = {
      ...location,
      address,
      placeName: location.placeName || location.place_name || address,
      lat,
      lng,
    };

    setSelected(normalized);
    setQuery(address);
    setSuggestions([]);
    setError("");

    if (onChange) {
      onChange(address);
    }

    if (onLocationSelect) {
      onLocationSelect(normalized);
    }

    if (mapRef.current && Number.isFinite(lat) && Number.isFinite(lng)) {
      updateMarker(lng, lat);

      if (moveMap) {
        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 15,
          essential: true,
        });
      }
    }
  };

  /* =========================================================
     SEARCH SUGGESTIONS
  ========================================================= */

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setSearching(false);

      return;
    }

    if (!mapboxgl.accessToken) {
      setError("Mapbox token is missing.");

      return;
    }

    clearTimeout(searchTimerRef.current);

    searchTimerRef.current = setTimeout(async () => {
      try {
        setSearching(true);
        setError("");

        const searchText = encodeURIComponent(query.trim());

        const url =
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json` +
          `?access_token=${encodeURIComponent(mapboxgl.accessToken)}` +
          `&autocomplete=true` +
          `&country=IN` +
          `&language=en` +
          `&limit=5`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Search failed.");
        }

        const data = await response.json();

        setSuggestions(Array.isArray(data.features) ? data.features : []);
      } catch (searchError) {
        console.error("Mapbox Search Error:", searchError);

        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(searchTimerRef.current);
    };
  }, [query]);

  /* =========================================================
     INIT MAP
  ========================================================= */

  useEffect(() => {
    if (!showMap || !mapContainerRef.current || !mapboxgl.accessToken) {
      return;
    }

    if (mapRef.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,

      style: getMapStyle(),

      center: [88.3639, 22.5726],

      zoom: 11,

      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      setMapReady(true);
    });

    map.on("click", async (event) => {
      try {
        setError("");
        setLocating(true);

        const { lng, lat } = event.lngLat;

        const location = await reverseGeocode(lng, lat);

        selectLocation(location);
      } catch (mapError) {
        console.error("Map Click Error:", mapError);

        setError(mapError.message || "Unable to select this location.");
      } finally {
        setLocating(false);
      }
    });

    mapRef.current = map;

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      map.remove();

      mapRef.current = null;
      markerRef.current = null;
    };
  }, [showMap]);

  /* =========================================================
     DETECT THEME CHANGES
  ========================================================= */

  useEffect(() => {
    if (!showMap) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (!mapRef.current) {
        return;
      }

      mapRef.current.setStyle(getMapStyle());

      mapRef.current.once("style.load", () => {
        if (selected?.lat !== undefined && selected?.lng !== undefined) {
          updateMarker(Number(selected.lng), Number(selected.lat));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [showMap, selected]);

  /* =========================================================
     CURRENT LOCATION
  ========================================================= */

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");

      return;
    }

    if (!mapboxgl.accessToken) {
      setError("Mapbox token is missing.");

      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;

          const lng = position.coords.longitude;

          const location = await reverseGeocode(lng, lat);

          selectLocation(location);
        } catch (locationError) {
          console.error("Current Location Error:", locationError);

          setError(
            locationError.message || "Unable to detect current location.",
          );
        } finally {
          setLocating(false);
        }
      },
      (geoError) => {
        console.error("Geolocation Error:", geoError);

        if (geoError.code === 1) {
          setError(
            "Location permission was denied. Please allow location access or search manually.",
          );
        } else {
          setError("Unable to detect your current location.");
        }

        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    );
  };

  /* =========================================================
     CLEAR
  ========================================================= */

  const clearLocation = () => {
    setQuery("");
    setSelected(null);
    setSuggestions([]);
    setError("");

    if (onChange) {
      onChange("");
    }

    if (onLocationSelect) {
      onLocationSelect({
        address: "",
        lat: null,
        lng: null,
      });
    }

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  };

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleInputChange = (event) => {
    const nextValue = event.target.value;

    setQuery(nextValue);
    setSelected(null);
    setError("");

    if (onChange) {
      onChange(nextValue);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="relative w-full">
      {/* =====================================================
          SEARCH AREA
      ===================================================== */}

      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-24 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={clearLocation}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              title="Clear location"
            >
              <X size={15} />
            </button>
          )}

          <button
            type="button"
            onClick={useCurrentLocation}
            disabled={locating}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
            title="Use current location"
          >
            {locating ?
              <Loader2 size={16} className="animate-spin" />
            : <LocateFixed size={16} />}
          </button>
        </div>
      </div>

      {/* =====================================================
          SUGGESTIONS
      ===================================================== */}

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {suggestions.map((place) => {
            const coordinates = place.center;

            return (
              <button
                key={place.id}
                type="button"
                onClick={() =>
                  selectLocation({
                    address: place.place_name || place.text || "",

                    placeName: place.text || place.place_name || "",

                    lat: coordinates?.[1],

                    lng: coordinates?.[0],
                  })
                }
                className="flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                />

                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {place.text || "Location"}
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                    {place.place_name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* =====================================================
          SEARCHING
      ===================================================== */}

      {searching && (
        <div className="absolute left-0 right-0 z-40 mt-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Loader2 size={14} className="animate-spin" />
            Searching locations...
          </div>
        </div>
      )}

      {/* =====================================================
          CURRENT LOCATION BUTTON
      ===================================================== */}

      <button
        type="button"
        onClick={useCurrentLocation}
        disabled={locating}
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
      >
        {locating ?
          <Loader2 size={15} className="animate-spin" />
        : <LocateFixed size={15} />}

        {locating ? "Detecting Location..." : "Use Current Location"}
      </button>

      {/* =====================================================
          MAP
      ===================================================== */}

      {showMap && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
          <div
            ref={mapContainerRef}
            className="h-[280px] w-full sm:h-[320px]"
          />

          {!mapboxgl.accessToken && (
            <div className="flex h-16 items-center px-4 text-xs font-semibold text-red-600 dark:text-red-400">
              Mapbox token is missing. Add VITE_MAPBOX_TOKEN to frontend/.env.
            </div>
          )}

          {mapReady && (
            <div className="border-t border-slate-200 bg-white px-4 py-2.5 text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              Click anywhere on the map to select a pickup location.
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </div>
      )}

      {/* =====================================================
          SELECTED LOCATION
      ===================================================== */}

      {selected?.address && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-start gap-2">
            <MapPin
              size={16}
              className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
            />

            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                Selected Pickup Location
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-700 dark:text-emerald-400">
                {selected.address}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocationPicker;
