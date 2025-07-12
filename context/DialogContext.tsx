"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

interface DialogContextType {
  showDialog: (content: React.JSX.Element) => void;
  hideDialog: () => void;
}

// Create a context for the dialog
const DialogContext = createContext<DialogContextType | undefined>(undefined);

/**
 * DialogProvider component that manages the state of the dialog modal.
 * It provides the showDialog and hideDialog functions to its children via context.
 * The dialog dismisses when the user clicks outside its content area.
 *
 * @param {object} { children } - React children to be rendered inside the provider.
 */
// Renamed from ToastProvider to DialogProvider
export const DialogProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.JSX.Element | undefined>(
    undefined
  );
  // Ref to the *overlay* div, not the content div, for click outside detection
  const overlayRef = useRef<HTMLDivElement>(null);
  // Ref for the actual dialog content area to check if a click was inside it
  const dialogContentRef = useRef<HTMLDivElement>(null);

  /**
   * Shows the dialog with the given JSX content.
   * @param {JSX.Element} dialogContent - The JSX content to display inside the dialog.
   */
  const showDialog = useCallback((dialogContent: React.JSX.Element) => {
    setContent(dialogContent);
    setIsOpen(true);
  }, []);

  /**
   * Hides the dialog.
   */
  const hideDialog = useCallback(() => {
    setIsOpen(false);
    setContent(undefined); // Clear content when hidden
  }, []);

  /**
   * Handles clicks on the overlay. If the click is outside the dialog content,
   * it dismisses the dialog.
   * @param {MouseEvent} event - The click event.
   */
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // If the click occurred on the overlay itself (not a child of the dialog content)
      if (
        overlayRef.current &&
        overlayRef.current === event.target && // Ensures the click was directly on the overlay
        dialogContentRef.current &&
        !dialogContentRef.current.contains(event.target as Node) // Ensures the click was NOT inside the dialog content
      ) {
        hideDialog();
      }
    },
    [hideDialog]
  );

  // Add and remove event listener for clicks on the overlay
  useEffect(() => {
    if (isOpen) {
      // Attach the mousedown listener to the overlay div directly
      // This is more precise than attaching to the document and then checking.
      // The onClick on the overlay div handles this directly.
      // The `setTimeout` is not needed here with the refined click logic.
      // We will attach the click handler to the overlay div in the JSX
      // and ensure clicks on dialog content are stopped from propagating.
    }
    // No explicit document listener needed here if the onClick is on the overlay div
    // and stopPropagation is used on the content div.
    return () => {
      // Cleanup if any global listeners were added, but with the current approach,
      // the listener is directly on the overlay element which is unmounted when `isOpen` is false.
    };
  }, [isOpen]); // Dependency on isOpen is sufficient

  // The value provided to the context consumers
  const contextValue = { showDialog, hideDialog };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}

      {/* Dialog Modal Overlay */}
      {isOpen && (
        <div
          ref={overlayRef} // Attach ref to the overlay
          className="w-full height-screen flex items-center justify-center p-6"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, .3)",
          }}
          onClick={handleOverlayClick} // Attach click handler directly to the overlay
        >
          {/* Dialog Content Container */}
          <div
            ref={dialogContentRef} // Attach ref here to the actual dialog box
            className="bg-white shadow-lg p-6 w-full overflow-auto"
            style={{
              borderRadius: "1.5rem",
              height: "80vh",
              maxWidth: "80rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Content */}
            <div className="mt-0">
              {content}{" "}
              {/* This is where the passed JSX content will be rendered */}
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

/**
 * Custom hook to consume the DialogContext.
 * Provides the showDialog and hideDialog functions.
 *
 * @returns {{showDialog: (dialogContent: JSX.Element) => void, hideDialog: () => void}}
 * @throws {Error} If used outside of a DialogProvider.
 */
export const useDialog = () => {
  const context = useContext(DialogContext);
  // Corrected null check to undefined as per createContext type
  if (context === undefined) {
    // Using console.error for development environment to highlight missing provider
    console.error(
      "Error: useDialog must be used within a DialogProvider. Check your component tree."
    );
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
