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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Checkbox,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";

const columns = [
  {
    key: "고객사명",
    label: "고객사명",
  },
  {
    key: "담당자명",
    label: "담당자명",
  },
  {
    key: "고객사ID",
    label: "고객사ID",
  },
  {
    key: "연락처",
    label: "연락처",
  },
];

const columns2 = [
  {
    key: "고객사명",
    label: "고객사명",
  },
  {
    key: "프로젝트명",
    label: "프로젝트명",
  },
  {
    key: "권한",
    label: "권한",
  },
];

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
const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
  { key: "dolphin", label: "Dolphin" },
  { key: "penguin", label: "Penguin" },
  { key: "zebra", label: "Zebra" },
  { key: "shark", label: "Shark" },
  { key: "whale", label: "Whale" },
  { key: "otter", label: "Otter" },
  { key: "crocodile", label: "Crocodile" },
];

function page({ params }) {
  const { accountNo } = params;
  const [totalPages, setTotalPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectsTotal, setProjectsTotal] = useState([]);
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [selectedKeys2, setSelectedKeys2] = React.useState(new Set([]));
  const [modalType, setModalType] = useState("");
  const [prevModalType, setPrevModalType] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterLoading1, setFilterLoading1] = useState(false);
  const [filterLoading2, setFilterLoading2] = useState(false);
  const [companyNames, setCompanyNames] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [value, setValue] = useState([]);

  const supabase = createClient();

  const getFilter1 = async () => {
    let { data: project, error } = await supabase.from("project").select("*");
    if (error) {
      console.log(error);
    } else {
      const companyNames = [
        { key: -1, label: "전체" },
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
    let { data: project, error } = await supabase
      .from("project")
      .select("*")
      .eq("companyName", selectedCompanyName);
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
      if (projectNames.length > 0) {
        projectNames.unshift({ key: -1, label: "전체" });
      }
      setProjectNames(projectNames);
      setFilterLoading2(true);
    }
  };
  console.log("companyNames:", companyNames);
  console.log("animals:", animals);
  const getItems = async () => {
    let {
      data: account,
      error,
      count,
    } = await supabase
      .from("account")
      .select("*", { count: "exact" })
      .eq("id", accountNo);
    
    if (error) {
      console.log(error);
    } else {
      
      const formattedAccount = account.map((item) => ({
        ...item,
        생성일자: item.created_at,
        고객사명: item.companyName,
        담당자명: item.staffName,
        고객사ID: item.customerId,
        고객사PW: item.customerPw,
        연락처: item.customerPhoneNo,
      }));
      setItems(formattedAccount);
    }
    let {
      data: project,
      error2,
      count2,
    } = await supabase
      .from("project")
      .select("*", { count: "exact" })
      .eq("companyName", account[0].companyName);

    if (selectedProjectName && selectedProjectName !== "전체") {
      project = project.filter(item => item.projectName === selectedProjectName);
    }

    if (error2) {
      console.log(error2);
    } else {
      const formattedProject = project.map((item) => ({
        ...item,
        생성일자: item.created_at,
        고객사명: item.companyName,
        프로젝트명: item.projectName,
        권한: item.authority ? "있음" : "없음",
      }));

      const projectsWithAuthority = formattedProject.filter(
        (item) => item.권한 === "있음"
      );
      const projectsWithoutAuthority = formattedProject.sort((a, b) =>
        b.권한.localeCompare(a.권한)
      );

      setProjects(projectsWithAuthority);
      setProjectsTotal(projectsWithoutAuthority);

      setIsLoading(true);
    }
    setValue([account[0]?.companyName.toString()])
    setSelectedCompanyName(account[0]?.companyName.toString())
  };

  console.log("items:",items)
  useEffect(() => {
    getItems();
    getFilter1();
  }, []);

  useEffect(() => {
    getFilter2();
    getItems();
  }, [selectedCompanyName, selectedProjectName]);

  const deleteSelectedItems = async () => {
    if (selectedKeys && selectedKeys.size > 0) {
      const changeList = Array.from(selectedKeys).map(Number);

      for (const updateId of changeList) {
        const { error } = await supabase
          .from("project")
          .update({ authority: false })
          .eq("id", updateId);

        if (error) {
          console.log("Error updating item with id:", updateId, error);
          break;
        }
      }
      getItems();
    }
  };

  const addSelectedItems = async () => {
    if (selectedKeys2 && selectedKeys2.size > 0) {
      const changeList = Array.from(selectedKeys2).map(Number);

      for (const updateId of changeList) {
        const { error } = await supabase
          .from("project")
          .update({ authority: true })
          .eq("id", updateId);

        if (error) {
          console.log("Error updating item with id:", updateId, error);
          break;
        }
      }
      getItems();
    }
  };

  console.log("selectedKeys2:",selectedKeys2)

  return (
    <div className="px-[20vw] py-[5vh] ">
      <div className="mb-5">
        <div>
          <h2 className="font-bold mb-3">고객사 계정 관리</h2>
        </div>
        <div className="flex w-full gap-x-2 justify-center">
          {isLoading ? (
            <Table
              aria-label="Controlled table example with dynamic content"
              className="w-full"
              isStriped
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn className="w-1/5 text-center" key={column.key}>
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={items}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell className="w-1/5 text-center">
                        {getKeyValue(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Spinner></Spinner>
          )}
        </div>
      </div>
      <div className="mb-5">
        <div>
          <h2 className="font-bold mb-3">고객사 계정 관리</h2>
        </div>
        <div className="flex w-full gap-x-2 justify-center">
          {isLoading ? (
            <Table
              aria-label="Controlled table example with dynamic content"
              className="w-full"
              selectionMode="multiple"
              isStriped
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}

            >
              <TableHeader columns={columns2}>
                {(column) => (
                  <TableColumn className="w-1/3 text-center" key={column.key}>
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={projects}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell className="w-1/3 text-center">
                        {columnKey === "권한" && item[columnKey] ? (
                          <span className="text-blue-500 font-bold">
                            {getKeyValue(item, columnKey)}
                          </span>
                        ) : (
                          getKeyValue(item, columnKey)
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <Spinner></Spinner>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex gap-x-2">
          <Button
            color="danger"
            radius="md"
            onPress={() => {
              setModalType("delete");
              setPrevModalType("delete");
              onOpen();
            }}
          >
            삭제
          </Button>
          <Button
            color="primary"
            radius="md"
            onPress={() => {
              setModalType("add");
              setPrevModalType("add");
              onOpen();
            }}
          >
            추가
          </Button>
        </div>
      </div>
      {modalType !== "complete" && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {modalType === "add" && "프로젝트 권한 추가"}
                  {modalType === "delete" && "고객사 계정 삭제"}
                </ModalHeader>
                <ModalBody>
                  {modalType === "add" && (
                    <>
                      <div className="flex gap-3 flex-col w-full gap-x-2 justify-between">
                        <div className="grid grid-cols-2 gap-x-2 w-2/3">
                          {filterLoading1 ? (
                            <>
                              <Select
                                placeholder="회사"
                                selectedKeys={value}
                                className="max-w-xs"
                                // onSelectionChange={setValue}
                                
                              >
                                {companyNames.map((animal) => (
                                  <SelectItem key={animal.label}>
                                    {animal.label}
                                  </SelectItem>
                                ))}
                              </Select>
                            </>
                          ) : (
                            <Spinner></Spinner>
                          )}
                          {projectNames.length > 0 ? (
                            <Select
                              items={projectNames}
                              placeholder="프로젝트"
                              className="w-full"
                            >
                              {(project) => (
                                <SelectItem
                                  onClick={() =>
                                    setSelectedProjectName(project.label)
                                  }
                                >
                                  {project.label}
                                </SelectItem>
                              )}
                            </Select>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="flex gap-2 flex-col w-full gap-x-2 justify-center">
                          <p>총 <span className="font-bold text-red-500">{projectsTotal.length}</span>개의 프로젝트가 검색되었습니다.</p>
                          {isLoading ? (
                            <Table
                              aria-label="Controlled table example with dynamic content"
                              className="w-full"
                              // selectionMode="multiple"
                              // selectedKeys={selectedKeys}
                              // onSelectionChange={setSelectedKeys}
                              isStriped
                            >
                              <TableHeader>
                                <TableColumn className="text-center">
                                  선택
                                </TableColumn>
                                <TableColumn className="text-center">
                                  고객사명
                                </TableColumn>
                                <TableColumn className="text-center">
                                  프로젝트명
                                </TableColumn>
                                <TableColumn className="text-center">
                                  권한
                                </TableColumn>
                              </TableHeader>
                              <TableBody items={projectsTotal}>
                                {(item) => (
                                  <TableRow key={item.id}>
                                    <TableCell className="w-1/4 text-center">
                                      <Checkbox
                                        isDisabled={item["권한"] === "있음"}
                                        onChange={(e) => {
                                          setSelectedKeys2((prevKeys) => {
                                            const newKeys = new Set(prevKeys);
                                            if (e.target.checked) {
                                              newKeys.add(item.id);
                                            } else {
                                              newKeys.delete(item.id);
                                            }
                                            return newKeys;
                                          });
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell className="w-1/4 text-center">
                                      {getKeyValue(item, "고객사명")}
                                    </TableCell>
                                    <TableCell className="w-1/4 text-center">
                                      {getKeyValue(item, "프로젝트명")}
                                    </TableCell>
                                    <TableCell className="w-1/4 text-center">
                                      {item["권한"] === "있음" ? (
                                        <span className="text-blue-500 font-bold">
                                          {getKeyValue(item, "권한")}
                                        </span>
                                      ) : (
                                        <span className="text-red-500 font-bold">
                                          {getKeyValue(item, "권한")}
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          ) : (
                            <Spinner></Spinner>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {modalType === "delete" && (
                    <>
                      <div>해당 프로젝트에 권한을 삭제 하시겠습니까?</div>
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="" variant="light" onPress={onClose}>
                    닫기
                  </Button>
                  {modalType === "add" && (
                    <Button
                      color="primary"
                      onPress={() => {
                        addSelectedItems();
                        setModalType("complete");
                      }}
                    >
                      추가하기
                    </Button>
                  )}
                  {modalType === "edit" && (
                    <Button
                      color="success"
                      onPress={() => {
                        changeSelectedItems();
                        setModalType("complete");
                      }}
                    >
                      수정하기
                    </Button>
                  )}
                  {modalType === "delete" && (
                    <Button
                      color="danger"
                      onPress={() => {
                        deleteSelectedItems();

                        setModalType("complete");
                      }}
                    >
                      삭제하기
                    </Button>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      {modalType === "complete" && (
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="flex p-5">
                  {prevModalType === "add" && <p>저장 되었습니다.</p>}
                  {prevModalType === "edit" && <p>수정이 완료되었습니다.</p>}
                  {prevModalType === "delete" && <p>삭제 되었습니다.</p>}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onPress={onClose}>
                    확인
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}

export default page;
