import { styles } from "../../styles/style";
import React, { FC, useRef, useState } from "react";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { MdVerifiedUser } from "react-icons/md";

type Props = {
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });

  const verifictionHandler = async () => {
    setInvalidError(true);
    console.log("Verificación en proceso...");
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-2xl md:text-3xl font-semibold text-center text-black dark:text-white mb-6">
        Verificar cuenta
      </h1>
      <div className="flex items-center justify-center mt-2">
        <div className="w-20 h-20 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center shadow-md">
          <VscWorkspaceTrusted size={40} className="text-white" />
        </div>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-16 h-16 bg-transparent border-2 rounded-lg flex items-center text-black dark:text-white justify-center text-xl font-semibold text-center outline-none transition-all duration-300 focus:border-blue-500 dark:focus:border-blue-400 ${
              invalidError
                ? "border-red-500 shake"
                : "border-gray-400 dark:border-gray-600"
            }`}
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          className={`${styles.button} flex items-center space-x-2`}
          onClick={verifictionHandler}
        >
          <MdVerifiedUser size={24} />
          <span>Verificar cuenta</span>
        </button>
      </div>
      <h5 className="text-center pt-4 text-sm text-black dark:text-white">
        Volver al inicio de sesión{" "}
        <span
          className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-bold"
          onClick={() => setRoute("Login")}
        >
          Iniciar sesión
        </span>
      </h5>
    </div>
  );
};

export default Verification;
