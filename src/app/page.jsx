"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";

export default function ClassicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const audioRef = useRef(null);

  const hamid = "908907:680a3be23f7a8";

  useEffect(() => {
    async function fetchMusic() {
      try {
        const res = await fetch(
          `https://one-api.ir/radiojavan/?token=${hamid}&action=new_songs`
        );
        const data = await res.json();
        setTracks(data.result);
        setCurrentTrackIndex(0);
      } catch (e) {
        console.error("Fetch error:", e);
      }
    }
    fetchMusic();
  }, []);

  useEffect(() => {
    if (currentTrackIndex !== null && audioRef.current) {
      audioRef.current.load();
      audioRef.current.volume = volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const seekAudio = (e) => {
    if (!audioRef.current) return;
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const changeVolume = (e) => {
    setVolume(e.target.value / 100);
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1 < tracks.length ? prev + 1 : 0));
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : tracks.length - 1
    );
  };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tracks, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#151515] via-[#0d0d0d] to-[#000000] text-[#f7f1e1] p-4 sm:p-8 flex flex-col lg:flex-row gap-6 font-serif select-none">
      {/* Playlist */}
      <aside className="w-full lg:w-1/3 bg-[#2f2f2f] rounded-2xl overflow-hidden shadow-2xl overflow-y-auto max-h-[100vh] p-4 sm:p-6 border border-[#a8821f]">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 border-b-2 border-[#c1a74a] pb-2 sm:pb-3 text-center tracking-wider drop-shadow-md">
          Playlist
        </h2>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-xl bg-[#1a1a1a] text-white placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#c1a74a] transition text-sm sm:text-base"
        />

        <ul className="space-y-2 sm:space-y-3 mt-3 sm:mt-5 max-h-[65vh] overflow-y-auto overflow-hidden">
  {filteredTracks.map((track, i) => (
    <li
      key={track.id}
      onClick={() => {
        const indexInAllTracks = tracks.findIndex((t) => t.id === track.id);
        setCurrentTrackIndex(indexInAllTracks);
      }}
      className={`cursor-pointer flex items-center gap-3 p-2 sm:p-3 rounded-xl transition-all duration-300 
        ${
          tracks[currentTrackIndex]?.id === track.id
            ? "bg-[#c1a74a] text-black font-semibold shadow-lg scale-105"
            : "hover:bg-[#444444] hover:scale-105"
        } text-sm sm:text-base`}
    >
      <img
        src={`https://api.allorigins.win/raw?url=${encodeURIComponent(track.thumbnail)}`}
        alt={track.title}
        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-[#777]"
        draggable={false}
      />
      <div className="flex-1">
        <p className="truncate">{track.title}</p>
        <p className="text-xs text-gray-400 truncate">{track.artist || "Unknown"}</p>
      </div>
    </li>
  ))}
  {filteredTracks.length === 0 && (
    <p className="text-center text-xs sm:text-sm text-[#ccc] italic mt-4">
      No results found.
    </p>
  )}
</ul>

      </aside>

      {/* Player */}
      <main className="flex-1 flex flex-col items-center bg-[#222222] rounded-3xl shadow-3xl p-4 sm:p-8 border-4 border-[#c1a74a] max-w-full">
        {currentTrackIndex !== null && tracks[currentTrackIndex] && (
          <>
            <div className="w-full max-w-md sm:w-96 sm:h-96 rounded-3xl overflow-hidden shadow-2xl mb-6 sm:mb-8 border-8 border-[#c1a74a] transform transition-transform duration-500 hover:scale-105">
              <img
                src={`https://api.allorigins.win/raw?url=${encodeURIComponent(
                  tracks[currentTrackIndex].thumbnail
                )}`}
                alt={tracks[currentTrackIndex].title}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold mb-1 sm:mb-2 text-center drop-shadow-lg px-2">
              {tracks[currentTrackIndex].title}
            </h3>
            <p className="text-center text-[#d9ce7f] mb-6 sm:mb-8 italic tracking-wide drop-shadow-sm px-2">
              {tracks[currentTrackIndex].artist || "Unknown Artist"}
            </p>

            <audio
              ref={audioRef}
              src={tracks[currentTrackIndex].link}
              onTimeUpdate={handleTimeUpdate}
              onEnded={playNext}
            />

            <div className="w-full flex items-center gap-3 sm:gap-5 mb-4 sm:mb-6 px-2">
              <span className="font-mono text-xs sm:text-sm drop-shadow-md w-12 text-left">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={seekAudio}
                className="flex-1 accent-[#c1a74a] rounded-lg cursor-pointer hover:accent-[#e3d56f] transition-colors"
              />
              <span className="font-mono text-xs sm:text-sm drop-shadow-md w-12 text-right">
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex  flex-wrap sm:flex-nowrap items-center gap-6 sm:gap-10 text-black px-2 justify-center">
              <button
                onClick={playPrev}
                className="text-2xl sm:text-5xl hover:text-[#f7e87f] transition-transform transform hover:scale-125 active:scale-110 shadow-lg rounded-full p-2"
                aria-label="Previous"
                title="Previous Track"
              >
                &#9664;&#9664;
              </button>

              <button
                onClick={togglePlay}
                className="text-3xl  sm:text-6xl hover:text-[#f7e87f] transition-transform transform hover:scale-125 active:scale-110 shadow-2xl rounded-full p-3 bg-gradient-to-br from-[#a88f3e] to-[#d4c857] drop-shadow-lg"
                aria-label={isPlaying ? "Pause" : "Play"}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>

              <button
                onClick={playNext}
                className="text-2xl sm:text-5xl hover:text-[#f7e87f] transition-transform transform hover:scale-125 active:scale-110 shadow-lg rounded-full p-2"
                aria-label="Next"
                title="Next"
              >
                &#9654;&#9654;
              </button>

              <div className="flex items-center gap-2 sm:gap-3 ml-4 sm:ml-8 w-full sm:w-auto max-w-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-[#c1a74a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z"
                  />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={changeVolume}
                  className="accent-[#c1a74a] rounded-lg cursor-pointer w-full"
                  aria-label="Volume control"
                  title="Volume"
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
