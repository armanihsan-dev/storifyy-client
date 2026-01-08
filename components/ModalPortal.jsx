// components/ModalPortal.tsx
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const ModalPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

export default ModalPortal;
