interface ButtonNavigationProps {
  isFirst: boolean;
  isLast: boolean;
}
export function ButtonNavigation({ isFirst, isLast }: ButtonNavigationProps) {
  return (
    <pre>
      <button type="submit" name="_action" value="back" disabled={isFirst}>
        {"Zurück"}
      </button>
      <button type="submit" name="_action" value="next">
        {isLast ? "Abschicken" : "Nächste Seite"}
      </button>
    </pre>
  );
}
