import {
    GoogleMap,
    Marker,
    InfoWindow,
    useLoadScript,
    Libraries,
} from "@react-google-maps/api";

import { useCallback, useEffect, useState } from "react";

const libraries: Libraries = ["places"];

type MarkerType = {
    lat: number;
    lng: number;
};

type mapProps = {
    center: MarkerType;
    address: string;
    setAddress: (s: string) => void;
};

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

const Map = ({ center, address, setAddress }: mapProps) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey,
        libraries,
    });
    const [mapCenter, setMapCenter] = useState<MarkerType>(center);
    const [marker, setMarker] = useState<MarkerType | null>(null);
    const [selected, setSelected] = useState<MarkerType | null>(null);

    useEffect(() => {
        setMapCenter(center);
    }, [center]);

    const onMapClick = useCallback(
        (e: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
            if (e.latLng) {
                setMarker({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                });
                const geocoder = new window.google.maps.Geocoder();
                return geocoder.geocode(
                    { location: { lat: e.latLng.lat(), lng: e.latLng.lng() } },
                    (results, status) => {
                        if (status === "OK") {
                            results && setAddress(results[0].formatted_address);
                        }
                    }
                );
            }
        },
        []
    );

    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            zoom={10}
            center={mapCenter}
            onClick={onMapClick}
            options={{
                mapTypeControl: false,
                streetViewControl: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP,
                },
            }}>
            {marker && (
                <Marker
                    key={`${marker.lat}-${marker.lng}`}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => {
                        setSelected(marker);
                    }}
                />
            )}
            {selected && (
                <InfoWindow
                    position={{ lat: selected.lat, lng: selected.lng }}
                    onCloseClick={() => {
                        setSelected(null);
                    }}>
                    <div>
                        <h3 style={{ fontSize: "16px" }}>Địa chỉ đã chọn:</h3>
                        <p style={{ fontSize: "14px" }}>{address}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default Map;
