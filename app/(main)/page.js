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
      <div className="px-[10vw] py-[5vh] ">
        <div className="mb-5">
          <div>
            <h2 className="font-bold mb-3">인플루언서 리스트</h2>
          </div>
          <div className="flex gap-x-2">
            <Select
              items={animals}
              placeholder="Select an animal"
              className="w-1/4"
            >
              {(animal) => <SelectItem>{animal.label}</SelectItem>}
            </Select>
            <Select
              items={animals}
              placeholder="Select an animal"
              className="w-1/4"
            >
              {(animal) => <SelectItem>{animal.label}</SelectItem>}
            </Select>
            <Button color="primary">검색</Button>
          </div>
        </div>
        <Divider className="my-4" />
        <div className="grid grid-cols-7 mb-5 gap-x-10 justify-center items-center">
          <div className="col-span-1">
            <Select
              items={animals}
              placeholder="Select an animal"
              className="w-full"
            >
              {(animal) => <SelectItem>{animal.label}</SelectItem>}
            </Select>
          </div>
          <div className="col-span-3 flex gap-x-2">
            <Select
              items={animals}
              placeholder="Select an animal"
              className="w-1/3"
            >
              {(animal) => <SelectItem>{animal.label}</SelectItem>}
            </Select>
            <Select
              items={animals}
              placeholder="Select an animal"
              className="w-1/3"
            >
              {(animal) => <SelectItem>{animal.label}</SelectItem>}
            </Select>
            <Select
              items={animals}
              placeholder="Select an animal"
              className="w-1/3"
            >
              {(animal) => <SelectItem>{animal.label}</SelectItem>}
            </Select>
          </div>
          <div className="col-span-3 grid grid-cols-4 gap-x-2">
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
        <div className="flex justify-between">
          <div className="flex gap-x-2">
            <Button radius="md">개별 등록</Button>
            <Button radius="md">엑셀 대량 등록</Button>
            <Button radius="md">추가 정보 대량 등록</Button>
          </div>

          <div className="flex gap-x-2">
            <Button radius="md">엑셀추출</Button>
            <Button color="primary" className="col-span-1">
              저장
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
