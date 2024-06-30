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
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modalType, setModalType] = useState("");
  const [changeCompanyName, setChangeCompanyName] = useState("");
  const [changeProjectName, setChangeProjectName] = useState("");
  const [prevModalType, setPrevModalType] = useState("");
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("user:", user);
      if (!user) {
        window.location.href = "/login";
      }
      if(user.id !== "cb1d1d38-ca7b-429a-8db5-770cd9085644"){
        window.location.href = '/?error=관리자만 접속 가능한 페이지입니다.';
      }
      setUser(user);      
    };
    checkUser();
  }, []);

  const getItems = async () => {
    const itemsPerPage = 20;
    const offset = (currentPage - 1) * itemsPerPage;
    let {
      data: project,
      error,
      count,
    } = selectedCompanyName && selectedCompanyName !== "전체"
      ? selectedProjectName && selectedProjectName !== "전체"
        ? await supabase
            .from("project")
            .select("*", { count: "exact" })
            .eq("companyName", selectedCompanyName)
            .eq("projectName", selectedProjectName)
            .or(
              `companyName.ilike.%${searchKeyword}%,projectName.ilike.%${searchKeyword}%`
            )
            .order("created_at", { ascending: false })
            .range(offset, offset + itemsPerPage - 1)
            
        : await supabase
            .from("project")
            .select("*", { count: "exact" })
            .eq("companyName", selectedCompanyName)
            .or(
              `companyName.ilike.%${searchKeyword}%,projectName.ilike.%${searchKeyword}%`
            )
            .order("created_at", { ascending: false })
            .range(offset, offset + itemsPerPage - 1)
      : searchKeyword
      ? await supabase
          .from("project")
          .select("*", { count: "exact" })
          .or(
            `companyName.ilike.%${searchKeyword}%,projectName.ilike.%${searchKeyword}%`
          )
          .order("created_at", { ascending: false })
          .range(offset, offset + itemsPerPage - 1)
      : await supabase
          .from("project")
          .select("*", { count: "exact" })
          .range(offset, offset + itemsPerPage - 1)
          .order("created_at", { ascending: false })

    if (!error) {
      setTotalPages(Math.ceil(count / itemsPerPage));
    }
    if (error) {
      console.log(error);
    } else {
      const formattedProject = project.map((item) => ({
        ...item,
        생성일자: item.created_at,
        고객사명: item.companyName,
        프로젝트명: item.projectName,
      }));

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
      };

      const formattedProjectWithDate = formattedProject.map((item) => ({
        ...item,
        생성일자: formatDate(item.created_at),
      }));
      setItems(formattedProjectWithDate);
    }
  };

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
  useEffect(() => {
    getFilter1();
    getItems();
  }, []);

  useEffect(() => {
    getFilter2();
    getItems();
  }, [selectedCompanyName, selectedProjectName, currentPage]);

  useEffect(() => {
    if (selectedKeys) {
      const lastSelectedKey = Array.from(selectedKeys).map(Number).pop();
      const selectedItem = items.find((item) => item.id === lastSelectedKey);

      if (selectedItem) {
        setChangeCompanyName(selectedItem.companyName);
        setChangeProjectName(selectedItem.projectName);
      }
    }
  }, [selectedKeys]);

  const deleteSelectedItems = async () => {
    if (selectedKeys && selectedKeys.size > 0) {
      const idsToDelete = Array.from(selectedKeys).map(Number);

      const { error } = await supabase
        .from("project")
        .delete()
        .in("id", idsToDelete);

      if (error) {
        console.log("Error deleting items:", error);
      } else {
        console.log("Delete successfully");
        // Optionally, refresh the items list after deletion
        getItems();
        getFilter1();
        getFilter2();
        setSelectedKeys([]);
      }
    } else {
      console.log("No items selected for deletion.");
    }
  };

  const changeSelectedItems = async () => {
    const lastSelectedKey = Array.from(selectedKeys).map(Number).pop();
    const { data, error } = await supabase
      .from("project")
      .update({
        companyName: changeCompanyName,
        projectName: changeProjectName,
      })
      .eq("id", lastSelectedKey)
      .select();
    if (error) {
      console.log(error);
    } else {
      console.log("Update successfully");
      getItems();
      getFilter1();
      getFilter2();
      setSelectedKeys([]);
    }
  };

  const addSelectedItems = async () => {
    const { data, error } = await supabase
      .from("project")
      .insert([
        { companyName: changeCompanyName, projectName: changeProjectName },
      ])
      .select();

    if (error) {
      console.log(error);
    } else {
      console.log("Add successfully");
      getItems();
      getFilter1();
      getFilter2();
      onOpen();
      setSelectedKeys([]);
    }
  };


  return (
    <>
      <div className="md:px-[20vw] px-[5vw] py-[5vh]">
        <div className="mb-5">
          <div>
            <h2 className="font-bold mb-3">프로젝트 관리</h2>
          </div>
          <div className="flex flex-col md:flex-row w-full gap-x-2 justify-between gap-y-2">
            <div className="grid grid-cols-2 gap-x-2  md:w-1/3 w-full">
              {filterLoading1 ? (
                <>
                  <Select
                    items={companyNames}
                    placeholder="회사 선택"
                    className="w-full"
                    defaultSelectedKeys={[-1]}
                  >
                    {(company) => (
                      <SelectItem
                        onClick={() => {
                          setSelectedCompanyName(company.label);
                          setSelectedProjectName("전체");
                          setCurrentPage(1);
                        }}
                      >
                        {company.label}
                      </SelectItem>
                    )}
                  </Select>
                </>
              ) : (
                <Spinner></Spinner>
              )}
              {projectNames.length > 0 ? (
                <Select
                  items={projectNames}
                  placeholder="프로젝트 선택"
                  className="w-full"
                  defaultSelectedKeys={[-1]}
                >
                  {(project) => (
                    <SelectItem
                      onClick={() => {
                        setSelectedProjectName(project.label);
                        setCurrentPage(1)
                      }}
                    >
                      {project.label}
                    </SelectItem>
                  )}
                </Select>
              ) : (
                <></>
              )}
            </div>

            <div className="flex gap-x-2">
              <Input
                type="text"
                placeholder="검색어를 입력하세요"
                className=""
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <Button color="primary" className="" onPress={() => getItems()}>
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
              <TableColumn className="w-1/3 text-center" key={column.key}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell className="w-1/3 text-center">
                    {getKeyValue(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center items-center my-5">
          
            <Pagination
              isCompact
              showControls
              total={totalPages}
              initialPage={1}
              onChange={(page) => {
                setCurrentPage(page);
                setSelectedKeys([]);
              }}
            />
        </div>
        <div className="flex justify-center items-center md:justify-end">
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
              color="success"
              radius="md"
              onPress={() => {
                setModalType("edit");
                setPrevModalType("edit");
                onOpen();
              }}
            >
              수정
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
      </div>
      {modalType !== "complete" && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {modalType === "add" && "프로젝트 추가"}
                  {modalType === "edit" && "프로젝트 수정"}
                  {modalType === "delete" && "프로젝트 삭제"}
                </ModalHeader>
                <ModalBody>
                  {modalType === "add" && (
                    <>
                      <Input
                        type="text"
                        label="고객사명"
                        placeholder="고객사명"
                        value={changeCompanyName}
                        onChange={(e) => setChangeCompanyName(e.target.value)}
                      />
                      <Input
                        type="text"
                        label="프로젝트명"
                        placeholder="프로젝트명"
                        value={changeProjectName}
                        onChange={(e) => setChangeProjectName(e.target.value)}
                      />
                    </>
                  )}
                  {modalType === "edit" && (
                    <>
                      <Input
                        type="text"
                        label="고객사명"
                        placeholder="고객사명"
                        value={changeCompanyName}
                        onChange={(e) => setChangeCompanyName(e.target.value)}
                      />
                      <Input
                        type="text"
                        label="프로젝트명"
                        placeholder="프로젝트명"
                        value={changeProjectName}
                        onChange={(e) => setChangeProjectName(e.target.value)}
                      />
                    </>
                  )}
                  {modalType === "delete" && (
                    <>
                      <p>삭제 시 데이터 복구가 어렵습니다</p>
                      <p>삭제 하시겠습니까?</p>
                    </>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="" variant="light" onPress={onClose}>
                    닫기
                  </Button>
                  {modalType === "add" && (
                    <Button
                      className="bg-[#b12928] text-white "
                      onPress={() => {
                        addSelectedItems();
                        setModalType("complete");
                      }}
                    >
                      추가
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
    </>
  );
}
