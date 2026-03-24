import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useActionMenu - A custom hook to manage the state and interactions of a dropdown/action menu.
 *
 * @param {Object} params - Configuration object.
 * @param {Array} params.options - An array of objects with { value, label } for the menu items.
 * @param {any} params.initialValue - The initial selected value.
 * @param {Function} params.onSelect - Callback function called when an option is selected.
 * @returns {Object} { value, selectedOption, handleSelect, isOpen, toggle, setIsOpen, containerRef, options }
 */
const useActionMenu = ({ options = [], initialValue, onSelect }) => {
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Find the currently selected option object
  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  const handleSelect = useCallback(
    (newValue) => {
      setValue(newValue);
      if (onSelect) onSelect(newValue);
      setIsOpen(false);

      // Accessibility: blur the active element to close DaisyUI dropdowns if they are focused
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    },
    [onSelect],
  );

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return {
    value,
    selectedOption,
    handleSelect,
    isOpen,
    setIsOpen,
    toggle,
    containerRef,
    options,
  };
};

export default useActionMenu;
