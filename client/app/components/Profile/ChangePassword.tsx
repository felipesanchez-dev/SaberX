"use client";
import React, { FC, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import toast from "react-hot-toast";

const ChangePassword: FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword] = useUpdatePasswordMutation();

  const passwordChangeHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      await updatePassword({ oldPassword, newPassword }).unwrap();
      toast.success("Contraseña cambiada exitosamente");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Ocurrió un error, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center mb-6">
        Cambiar Contraseña
      </h2>
      <form onSubmit={passwordChangeHandler} className="space-y-5">
        {/* Contraseña Actual */}
        <div className="relative">
          <label className="block text-gray-800 dark:text-gray-200 pb-2 font-bold">
            Contraseña Actual
          </label>
          <input
            type={showOldPassword ? "text" : "password"}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-gray-600 dark:text-gray-200"
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            {showOldPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        {/* Nueva Contraseña */}
        <div className="relative">
          <label className="block text-gray-800 dark:text-gray-200 pb-2 font-bold">
            Nueva Contraseña
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-gray-600 dark:text-gray-200"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        {/* Confirmar Nueva Contraseña */}
        <div className="relative">
          <label className="block text-gray-800 dark:text-gray-200 pb-2 font-bold">
            Confirmar Nueva Contraseña
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute right-3 top-10 text-gray-600 dark:text-gray-200"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-teal-500 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <ImSpinner2 className="animate-spin mx-auto text-3xl" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <AiOutlineLock size={25} /> Cambiar Contraseña
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
