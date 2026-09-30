"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SelectContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  disabled?: boolean;
};

type SelectRootProps = {
  name?: string;
  required?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelect() {
  const context = React.useContext(SelectContext);

  if (!context) {
    throw new Error("useSelect must be used within SelectRoot");
  }

  return context;
}

export default function SelectRoot({
  name,
  required = false,
  children,
  disabled = false,
  className,
}: SelectRootProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    setOpen(true);
  }, [disabled]);

  const toggleMenu = useCallback(() => {
    if (open) closeMenu();
    else openMenu();
  }, [open, closeMenu, openMenu]);

  const onValueChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        triggerRef.current?.focus();
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        triggerRef.current?.focus();
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeMenu]);

  const contextValue = useMemo<SelectContextValue>(
    () => ({
      value,
      onValueChange,
      open,
      setOpen,
      openMenu,
      closeMenu,
      toggleMenu,
      triggerRef,
      wrapperRef,
      disabled,
    }),
    [value, onValueChange, open, openMenu, closeMenu, toggleMenu, disabled]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div
        ref={wrapperRef}
        className={`relative inline-flex ${className ?? ""}`}
      >
        {name && (
          <input
            type="hidden"
            name={name}
            value={value}
            disabled={disabled}
            required={required}
          />
        )}

        {children}
      </div>
    </SelectContext.Provider>
  );
}