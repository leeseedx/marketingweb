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
import { Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
} from "@nextui-org/react";
import { useState } from "react";
import { users } from "./components/data";
import { animals } from "./components/data";

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;
  const [checkedItems, setCheckedItems] = React.useState({});
  const [selectAll, setSelectAll] = React.useState(false);

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);

  const handleCheckboxChange = (name) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newCheckedItems = {};
    if (newSelectAll) {
      items.forEach((item) => {
        newCheckedItems[item.name] = true;
      });
    } else {
      items.forEach((item) => {
        newCheckedItems[item.name] = false;
      });
    }
    setCheckedItems(newCheckedItems);
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="px-[20vw] py-[5vh] ">
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
          <div className="col-span-3 grid grid-cols-3 gap-x-2">
            <Select
              items={animals}
              placeholder="Select an animal"
              className="col-span-1"
            >
              {(animal) => <SelectItem>{animal.label}</SelectItem>}
            </Select>
            <Select
              items={animals}
              placeholder="Select an animal"
              className="col-span-1"
            >
              {(animal) => <SelectItem>{animal.label}</SelectItem>}
            </Select>
            <Select
              items={animals}
              placeholder="Select an animal"
              className="col-span-1"
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
          aria-label="Example table with client side pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            <TableColumn key="checkbox">
              <Checkbox
                isSelected={selectAll}
                onChange={handleSelectAllChange}
              />
            </TableColumn>
            <TableColumn key="name">NAME</TableColumn>
            <TableColumn key="role">ROLE</TableColumn>
            <TableColumn key="status">STATUS</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.name}>
                {(columnKey) => (
                  <TableCell>
                    {columnKey === "checkbox" ? (
                      <Checkbox
                        isSelected={checkedItems[item.name] || false}
                        onChange={() => handleCheckboxChange(item.name)}
                      />
                    ) : (
                      getKeyValue(item, columnKey)
                    )}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between">
          <div className="flex gap-x-2">
            <Button variant="bordered" radius="md" onPress={onOpen}>
              개별 등록
            </Button>
            <Button variant="bordered" radius="md" onPress={onOpen}>
              엑셀 대량 등록
            </Button>
            <Button variant="bordered" radius="md" onPress={onOpen}>
              추가 정보 대량 등록
            </Button>
          </div>

          <div className="flex gap-x-2">
            <Button variant="bordered" radius="md" onPress={onOpen}>
              엑셀추출
            </Button>
            <Button color="primary" className="col-span-1" onPress={onOpen}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
