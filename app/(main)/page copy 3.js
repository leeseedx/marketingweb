"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  Spinner
} from "@nextui-org/react";
import { users } from "./components/data";
import { animals } from "./components/data";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editingHeight, setEditingHeight] = useState({});

  const { data, isLoading } = useSWR(`https://swapi.py4e.com/api/people?page=${page}`, fetcher, {
    keepPreviousData: true,
  });

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  useEffect(() => {
    if (data?.results) {
      setSelected(data.results.map(item => ({ ...item, checked: selectAll })));
    }
  }, [data, selectAll]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelected(prevSelected => prevSelected.map(item => ({ ...item, checked: !selectAll })));
  };

  const handleCheckboxChange = (name) => {
    setSelected(prevSelected =>
      prevSelected.map(item =>
        item.name === name ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleHeightClick = (name) => {
    setEditingHeight({ ...editingHeight, [name]: true });
  };

  const handleHeightChange = (name, value) => {
    setSelected(prevSelected =>
      prevSelected.map(item =>
        item.name === name ? { ...item, height: value } : item
      )
    );
  };

  const handleHeightBlur = (name) => {
    setEditingHeight({ ...editingHeight, [name]: false });
  };

  const loadingState = isLoading || data?.results.length === 0 ? "loading" : "idle";



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
        isStriped
        className='mb-5'
      aria-label="Example table with client async pagination"
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader>
        <TableColumn key="checkbox">
          <Checkbox isSelected={selectAll} onChange={handleSelectAll} />
        </TableColumn>
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="height">Height</TableColumn>
        <TableColumn key="mass">Mass</TableColumn>
        <TableColumn key="birth_year">Birth year</TableColumn>
      </TableHeader>
      <TableBody
        items={selected ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
        
      >
        {(item) => (
          <TableRow key={item?.name}>
            <TableCell>
              <Checkbox isSelected={item.checked} onChange={() => handleCheckboxChange(item.name)} />
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.height}</TableCell>
            <TableCell>{item.mass}</TableCell>
            <TableCell>{item.birth_year}</TableCell>
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
