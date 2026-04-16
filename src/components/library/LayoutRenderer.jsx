import { useFormContext } from "react-hook-form";
import ComponentRenderer from "../ComponentRenderer";

function LayoutRenderer({
  fieldName,
  type = "grid",
  Column = [1],
  Row = [1],
  fields = [],
  gap = 4,
  ...props
}) {
  const { control } = useFormContext();

  // Build CSS grid template
  const gridTemplateColumns = Column.map((c) => `${c}fr`).join(" ");
  const gridTemplateRows = Row.map((r) => `${r}fr`).join(" ");

  return (
    <div
      className={`w-full grid`}
      style={{
        gridTemplateColumns,
        gridTemplateRows,
        gap: `${gap}rem`,
      }}
      {...props}
    >
      {fields.map((field, index) => {
        const { grid, ...fieldConfig } = field;

        // Calculate grid placement from config (0-indexed to 1-indexed for CSS)
        const gridColumn = grid?.cols
          ? `${grid.cols[0] + 1} / ${grid.cols[1] + 1}`
          : "auto";
        const gridRow = grid?.rows
          ? `${grid.rows[0] + 1} / ${grid.rows[1] + 1}`
          : "auto";

        return (
          <div
            key={field.field_name || `field-${index}`}
            style={{
              gridColumn,
              gridRow,
            }}
            className="min-w-0"
          >
            <ComponentRenderer config={fieldConfig} />
          </div>
        );
      })}
    </div>
  );
}

export default LayoutRenderer;
