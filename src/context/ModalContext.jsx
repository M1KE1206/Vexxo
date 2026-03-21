import { createContext, useContext, useState, useCallback } from "react";

/**
 * ModalContext — controls the service request modal.
 *
 * prefillData shape (optional, passed from PricingCalculator):
 * {
 *   fromCalculator: true,
 *   serviceType: "landing" | "multipage" | "ecommerce",
 *   pages: number,
 *   seoAddon: boolean,
 *   contentAddon: boolean,
 *   timeline: "7days" | "14days" | "regular",
 *   calculatedPrice: number,
 * }
 */

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [isOpen,      setIsOpen]      = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  const openModal = useCallback((data = null) => {
    setPrefillData(data);
    setIsOpen(true);
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, prefillData, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
}
