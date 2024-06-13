"use client";
import React, { useEffect, useState } from "react";
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { createClient } from "@/utils/supabase/client";

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
    key: "생성일자",
    label: "생성일자",
  },
  {
    key: "고객사명",
    label: "고객사명",
  },
  {
    key: "프로젝트명",
    label: "프로젝트명",
  },
];

export default function App() {
  const [selectedKeys, setSelectedKeys] = useState();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [companyNames, setCompanyNames] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [filterLoading1, setFilterLoading1] = useState(false);
  const [filterLoading2, setFilterLoading2] = useState(false);
  const supabase = createClient();
  const [items,setItems] = useState([]);
  
  const getItems = async () => {
    let { data: project, error } = await supabase.from("project").select("*");
    if (error) {
      console.log(error);
    } else {
      const formattedProject = project.map(item => ({
        ...item,
        생성일자: item.created_at,
        고객사명: item.companyName,
        프로젝트명: item.projectName,
      }));
      setItems(formattedProject);
    }
  };

  console.log('items:',items)

  const getFilter1 = async () => {
    let { data: project, error } = await supabase.from("project").select("*");
    if (error) {
      console.log(error);
    } else {
      const companyNames = [
        ...project.reduce((acc, item, index) => {
          if (!acc.some(({ label }) => label === item.companyName)) {
            acc.push({ key: index, label: item.companyName });
          }
          return acc;
        }, []),
      ];
      setCompanyNames(companyNames);
      setFilterLoading1(true);
    }
  };
  const getFilter2 = async () => {
    let { data: project, error } = await supabase.from("project").select("*").eq("companyName",selectedCompanyName);
    if (error) {
      console.log(error);
    } else {
      const projectNames = [
        ...project.reduce((acc, item, index) => {
          if (!acc.some(({ label }) => label === item.projectName)) {
            acc.push({ key: index, label: item.projectName });
          }
          return acc;
        }, []),
      ];
      setProjectNames(projectNames);
      setFilterLoading2(true);
    }
  };
  useEffect(() => {
    getFilter1();
    getItems()
  }, []);

  useEffect(()=>{
    getFilter2();
  },[selectedCompanyName,selectedProjectName])
  

  console.log(companyNames)
  console.log('projectNames:',projectNames)
  console.log('selectedCompanyName:',selectedCompanyName)

  return (
    <>
      <div className="px-[20vw] py-[5vh] ">
        <div className="mb-5">
          <div>
            <h2 className="font-bold mb-3">프로젝트 관리</h2>
          </div>
          <div className="flex w-full gap-x-2 justify-between">
            <div className="grid grid-cols-2 gap-x-2  w-1/3">
              {filterLoading1 ? (
                <>
                  <Select
                    items={companyNames}
                    placeholder="Select an animal"
                    className="w-full"
                  >
                    {(company) => (
                      <SelectItem onClick={() => setSelectedCompanyName(company.label)}>
                        {company.label}
                      </SelectItem>
                    )}
                  </Select>
                  
                </>
              ) : (
                <Spinner></Spinner>
              )}
              {
                projectNames.length>0?(
                  <Select
                  items={projectNames}
                  placeholder="Select an animal"
                  className="w-full"
                >
                  {(project) => <SelectItem>{project.label}</SelectItem>}
                </Select>
                ):(
                  <></>
                )
              }

            </div>

            <div className="flex gap-x-2">
              <Input
                type="text"
                placeholder="검색어를 입력하세요"
                className=""
              />
              <Button color="primary" className="">
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
          <TableBody items={items}>
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
        <div className="flex justify-end">
          <div className="flex gap-x-2">
            <Button color="danger" radius="md" onPress={onOpen}>
              삭제
            </Button>
            <Button color="success" radius="md" onPress={onOpen}>
              수정
            </Button>
            <Button color="primary" radius="md" onPress={onOpen}>
              추가
            </Button>
          </div>
        </div>
      </div>
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
    </>
  );
}
