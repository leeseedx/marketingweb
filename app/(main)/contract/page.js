"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { Pagination } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { animals } from "./components/data";
import { Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

const rows = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
];

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "status",
    label: "STATUS",
  },
];

export default function App() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["2"]));

  return (
    <>
      <div className="px-[20vw] py-[5vh] ">
        <div className="mb-5">
          <div>
            <h2 className="font-bold mb-3">계약자 관리</h2>
          </div>
          <div className="flex w-full gap-x-2 justify-between">
            <div className="grid grid-cols-2 gap-x-2 w-1/3">
              <Select
                items={animals}
                placeholder="Select an animal"
                className="w-full"
              >
                {(animal) => <SelectItem>{animal.label}</SelectItem>}
              </Select>
              <Select
                items={animals}
                placeholder="Select an animal"
                className="w-full"
              >
                {(animal) => <SelectItem>{animal.label}</SelectItem>}
              </Select>
            </div>

            <div className="grid grid-cols-4 gap-x-2 w-1/2">
              <Select
                items={animals}
                placeholder="Select an animal"
                className="col-span-1"
              >
                {(animal) => <SelectItem>{animal.label}</SelectItem>}
              </Select>
              <Input
                type="text"
                placeholder="검색어를 입력하세요"
                className="col-span-2"
              />
              <Button color="primary" className="col-span-1">
                검색
              </Button>
            </div>
          </div>
        </div>

        <Table
          aria-label="Controlled table example with dynamic content"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          className="w-full"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.key}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center items-center my-5">
          <Pagination isCompact showControls total={10} initialPage={1} />
        </div>
        
      </div>
    </>
  );
}
