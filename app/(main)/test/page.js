'use client'
import React from "react";
import {Select, SelectItem} from "@nextui-org/react";
import {animals} from "../components/data";

export default function App() {
  const [values, setValues] = React.useState(new Set(["cat", "dog"]));

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Select
        label="Favorite Animal"
        selectionMode="multiple"
        placeholder="Select an animal"
        selectedKeys={values}
        className="max-w-xs"
        onSelectionChange={setValues}
      >
        {animals.map((animal) => (
          <SelectItem key={animal.key}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>
      <p className="text-small text-default-500">Selected: {Array.from(values).join(", ")}</p>
    </div>
  );
}
