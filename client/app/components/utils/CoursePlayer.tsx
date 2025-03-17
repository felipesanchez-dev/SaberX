import React, { FC, useEffect, useState } from "react";
import axios from "axios";

type Props = {
  videoUrl: string;
  title: string;
};

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({ otp: "", playbackInfo: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchVideoData = async (retries = 2) => {
    if (!videoUrl) {
      setError("⚠️ No se proporcionó el ID del video");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `http://localhost:8000/api/v1/getVdoCipherOTP`,
        {
          videoId: videoUrl,
        }
      );

      setVideoData(res.data);
    } catch (error: any) {
      console.error("Error al obtener OTP:", error);

      if (error.response?.data?.message) {
        setError(`❌ ${error.response.data.message}`);
      } else {
        setError("No se pudo cargar el video. Por favor, inténtalo de nuevo.");
      }

      if (retries > 0) {
        console.warn(`🔁 Reintentando... (${2 - retries + 1})`);
        setTimeout(() => fetchVideoData(retries - 1), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoUrl]);

  return (
    <div className="relative w-full max-w-4xl aspect-video bg-gray-200 dark:bg-gray-800 flex justify-center items-center mx-auto rounded-lg shadow-lg overflow-hidden">
      {loading && (
        <div className="text-gray-500 animate-pulse">⏳ Cargando video...</div>
      )}
      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {videoData.otp && videoData.playbackInfo !== "" && !loading && !error && (
        <iframe
          title={title || "Curso en reproducción"}
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
          style={{
            border: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;
