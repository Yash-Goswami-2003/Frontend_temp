export function useSDUIForm() {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = createFormStore();
  }

  return storeRef.current;
}   