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
import { Icon } from "@iconify/react";

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
    key: "고객사명",
    label: "고객사명",
  },
  {
    key: "프로젝트명",
    label: "프로젝트명",
  },
  {
    key: "ID",
    label: "ID",
  },
  {
    key: "URL",
    label: "URL",
  },
  {
    key: "이름",
    label: "이름",
  },
  {
    key: "연락처",
    label: "연락처",
  },
  {
    key: "이메일",
    label: "이메일",
  },
  {
    key: "은행",
    label: "은행",
  },
  {
    key: "예금주",
    label: "예금주",
  },
  {
    key: "계좌번호",
    label: "계좌번호",
  },
  {
    key: "계약비용",
    label: "계약비용",
  },
];

const showUnits = [
  {
    key: 15,
    label: "15개씩 보기",
  },
  {
    key: 30,
    label: "30개씩 보기",
  },
  {
    key: 50,
    label: "50개씩 보기",
  },
  {
    key: 100,
    label: "100개씩 보기",
  },
  {
    key: 200,
    label: "200개씩 보기",
  },
];

export default function App() {
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [companyNames, setCompanyNames] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [selectUnits, setSelectUnits] = useState(15);
  const [filterLoading1, setFilterLoading1] = useState(false);
  const [filterLoading2, setFilterLoading2] = useState(false);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modalType, setModalType] = useState("");
  const [changeCompanyName, setChangeCompanyName] = useState("");
  const [changeProjectName, setChangeProjectName] = useState("");
  const [prevModalType, setPrevModalType] = useState("");
  const [files, setFiles] = useState([]);
  const [checkedInfos, setCheckedInfos] = useState({});
  //필터값들

  
  
  const getInfos = () => {
    const lastSelectedKey = Array.from(selectedKeys).pop();
    const selectedItem = items.find(
      (item) => String(item.id) === String(lastSelectedKey)
    );
    console.log("selectedItem:",selectedItem)
    const getAccountInfo = async () => {
      if (selectedItem) {
        const { data, error } = await supabase
          .from("registerItems")
          .select("*")
          .eq("id", selectedItem.id);

        if (error) {
          console.error("Error fetching account info:", error);
        } else {
          console.log("Account info:", data);
          setCheckedInfos(data[0]);
        }
      } else {
        console.log("No item selected.");
      }
    };

    getAccountInfo();
  };

  const supabase = createClient();

  const getItems = async () => {
    // const itemsPerPage = 20;
    const offset = (currentPage - 1) * selectUnits;
    let {
      data: registerItems,
      error,
      count,
    } = selectedCompanyName && selectedCompanyName !== "전체"
      ? selectedProjectName && selectedProjectName !== "전체"
        ? await supabase
            .from("registerItems")
            .select("*", { count: "exact" })
            .eq("고객사명", selectedCompanyName)
            .eq("프로젝트명", selectedProjectName)
            .eq("분류", "승인")
            .or(
              `고객사명.ilike.%${searchKeyword}%,프로젝트명.ilike.%${searchKeyword}%`
            )
            .order("생성일자", { ascending: false })
            .range(offset, offset + selectUnits - 1)
        : await supabase
            .from("registerItems")
            .select("*", { count: "exact" })
            .eq("고객사명", selectedCompanyName)
            .eq("분류", "승인")
            .or(
              `고객사명.ilike.%${searchKeyword}%,프로젝트명.ilike.%${searchKeyword}%`
            )
            .order("생성일자", { ascending: false })
            .range(offset, offset + selectUnits - 1)
      : searchKeyword
      ? await supabase
          .from("registerItems")
          .select("*", { count: "exact" })
          .or(
            `고객사명.ilike.%${searchKeyword}%,프로젝트명.ilike.%${searchKeyword}%`
          )
          .order("생성일자", { ascending: false })
          .eq("분류", "승인")
          .range(offset, offset + selectUnits - 1)
      : await supabase
          .from("registerItems")
          .select("*", { count: "exact" })
          .eq("분류", "승인")
          .order("생성일자", { ascending: false })
          .range(offset, offset + selectUnits - 1);

    if (!error) {
      setTotalPages(Math.ceil(count / selectUnits));
    }
    if (error) {
      console.log(error);
    } else {
      // const formattedProject = project.map((item) => ({
      //   ...item,
      //   생성일자: item.created_at,
      //   고객사명: item.companyName,
      //   프로젝트명: item.projectName,
      //   ID: item.accountId.customerId,
      //   URL: item.accountId.customerUrl,
      //   이름: item.accountId.staffName,
      //   연락처: item.accountId.customerPhoneNo,
      //   이메일: item.accountId.customerEmail,
      //   은행: item.accountId.bankName,
      //   예금주: item.accountId.bankAccountName,
      //   계좌번호: item.accountId.bankAccountNo,
      //   계약비용: item.accountId.contractCharge,
      // }));
      const formattedProject=registerItems

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
      };

      const formattedProjectWithDate = formattedProject.map((item) => ({
        ...item,
        생성일자: formatDate(item.생성일자),
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
  }, [selectedCompanyName, selectedProjectName, currentPage, selectUnits]);

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
    }
  };

  const getFiles = async () => {
    if (selectedKeys && selectedKeys.size > 0) {
      const lastSelectedKey = Number(Array.from(selectedKeys).pop());
      const selectedItem = items.find((item) => item.id === lastSelectedKey);
      console.log(selectedItem);
      if (selectedItem) {
        const { data, error } = await supabase.storage
          .from("assets")
          .list(`uploads/${selectedItem.ID}`);

        if (error) {
          console.error("Error listing files:", error);
        } else {
          setFiles(data);
          console.log("Files in project folder:", data);
        }
      } else {
        console.log("No item selected.");
      }
    }
  };

  const changeInfos = async () => {
    const lastSelectedKey = Number(Array.from(selectedKeys).pop());
    const selectedItem = items.find((item) => item.id === lastSelectedKey);

    const { data, error } = await supabase
      .from("registerItems")
      .update(checkedInfos)
      .eq("id", selectedItem.id)
      .select();
    if (error) {
      console.log(error);
    } else {
      console.log("Update successfully");
    }
  };

  const getDownload = async (e) => {
    const lastSelectedKey = Number(Array.from(selectedKeys).pop());
    const selectedItem = items.find((item) => item.id === lastSelectedKey);

    if (selectedItem) {
      const fileName = e.target.closest("button").textContent.trim();
      const { data, error } = await supabase.storage
        .from("assets")
        .download(`uploads/${selectedItem.ID}/${fileName}`);

      if (error) {
        console.error("Error downloading file:", error);
      } else {
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        console.log("File downloaded successfully");
      }
    } else {
      console.log("No item selected.");
    }
  };

  console.log('checkedInfos:',checkedInfos)

  return (
    <>
      <div className="px-[20vw] py-[5vh] ">
        <div className="mb-5">
          <div>
            <h2 className="font-bold mb-3">계약자 관리</h2>
          </div>
          <div className="flex w-full gap-x-2 justify-between">
            <div className="grid grid-cols-2 gap-x-2  w-1/3">
              {filterLoading1 ? (
                <>
                  <Select
                    items={companyNames}
                    placeholder="고객사명 선택"
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
                  placeholder="프로젝트명 선택"
                  className="w-full"
                  defaultSelectedKeys={[-1]}
                >
                  {(project) => (
                    <SelectItem
                      onClick={() => {
                        setSelectedProjectName(project.label);
                        setCurrentPage(1);
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

            <div className="flex gap-x-2 w-1/3">
              <Select
                defaultSelectedKeys={['15']}
                items={showUnits}
                placeholder="갯수"
                className="w-full"
              >
                {(unit) => (
                  <SelectItem
                    key={unit.key}
                    className="w-full"
                    onClick={() => {
                      setSelectUnits(unit.key);
                      setCurrentPage(1);
                    }}
                  >
                    {unit.label}
                  </SelectItem>
                )}
              </Select>
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
              <TableColumn className="w-1/7 text-center" key={column.key}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell className="w-1/7 text-center text-nowrap">
                    {getKeyValue(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center items-center my-5">
          {totalPages>=1 && (
            <Pagination
              isCompact
              showControls
              total={totalPages}
              initialPage={1}
              onChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
        <div className="flex justify-end">
          <div className="flex gap-x-2">
            <Button
              color="success"
              radius="md"
              className=""
              onPress={() => {
                if (selectedKeys.size === 0) {
                  setModalType("error");
                  setPrevModalType("error");
                  onOpen();
                } else {
                  setModalType("view");
                  setPrevModalType("view");
                  onOpen();
                  getFiles();
                  getInfos();
                }
              }}
            >
              수정
            </Button>
          </div>
        </div>
      </div>
      {modalType !== "complete" && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {modalType === "view" && "자세히 보기"}
                  {modalType === "edit" && "프로젝트 수정"}
                  {modalType === "error" && "오류"}
                </ModalHeader>
                <ModalBody>
                  {modalType === "view" && (
                    <>
                      <h3 className="font-bold">기본정보</h3>
                      <div className="flex gap-2 my-2">
                        <Input
                          type="text"
                          label="이메일"
                          placeholder="이메일"
                          value={checkedInfos.이메일}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              이메일: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="text"
                          label="이름"
                          placeholder="이름"
                          value={checkedInfos.이름}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              이름: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="text"
                          label="연락처"
                          placeholder="연락처"
                          value={checkedInfos.연락처}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              연락처: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 my-2">
                        <div className="col-span-1">
                          <Input
                            type="text"
                            label="우편번호"
                            placeholder="우편번호"
                            value={checkedInfos.우편번호}
                            onChange={(e) =>
                              setCheckedInfos({
                                ...checkedInfos,
                                우편번호: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="text"
                            label="주소"
                            placeholder="주소"
                            value={checkedInfos.주소}
                            onChange={(e) =>
                              setCheckedInfos({
                                ...checkedInfos,
                                주소: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 my-2">
                        <Input
                          type="text"
                          label="배송메모"
                          placeholder="배송메모"
                          value={checkedInfos.배송메모}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              배송메모: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="text"
                          label="택배사"
                          placeholder="택배사"
                          value={checkedInfos.택배사}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              택배사: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="text"
                          label="송장번호"
                          placeholder="송장번호"
                          value={checkedInfos.송장번호}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              송장번호: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="my-2">
                        <Input
                          type="text"
                          label="사업자등록번호"
                          placeholder="사업자등록번호"
                          value={checkedInfos.사업자등록번호}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              사업자등록번호: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">계약정보</h3>
                        <div className="grid grid-cols-2 gap-2 my-2">
                          <Input
                            className="col-span-1"
                            type="text"
                            label="은행"
                            placeholder="은행"
                            value={checkedInfos.은행}
                            onChange={(e) =>
                              setCheckedInfos({
                                ...checkedInfos,
                                은행: e.target.value,
                              })
                            }
                          />
                          <Input
                            className="col-span-1"
                            type="text"
                            label="예금주"
                            placeholder="예금주"
                            value={checkedInfos.예금주}
                            onChange={(e) =>
                              setCheckedInfos({
                                ...checkedInfos,
                                예금주: e.target.value,
                              })
                            }
                          />
                          <Input
                            className="col-span-1"
                            type="text"
                            label="계좌번호"
                            placeholder="계좌번호"
                            value={checkedInfos.계좌번호}
                            onChange={(e) =>
                              setCheckedInfos({
                                ...checkedInfos,
                                계좌번호: e.target.value,
                              })
                            }
                          />
                          <Input
                            className="col-span-1"
                            type="text"
                            label="계약비용"
                            placeholder="계약비용"
                            value={checkedInfos.계약비용}
                            onChange={(e) =>
                              setCheckedInfos({
                                ...checkedInfos,
                                계약비용: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="my-2 flex flex-col gap-2">
                        <div className="flex items-center gap-5">
                          <h3 className="font-bold">첨부파일</h3>
                          <Button
                            size="sm"
                            startContent={
                              <Icon
                                className="text-default-500 z-50"
                                icon="solar:paperclip-linear"
                                width={18}
                              />
                            }
                            variant="flat"
                            onPress={async () => {
                              const lastSelectedKey = Number(
                                Array.from(selectedKeys).pop()
                              );
                              console.log(
                                "Last selected key:",
                                lastSelectedKey
                              );
                              const selectedItem = items.find(
                                (item) => item.id === lastSelectedKey
                              );
                              console.log("Selected item:", selectedItem);
                              const fileInput = document.createElement("input");
                              fileInput.type = "file";
                              fileInput.onchange = async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  console.log("Selected file:", file.name);
                                  const { data, error } = await supabase.storage
                                    .from("assets") // Replace with your bucket name
                                    .upload(
                                      `uploads/${selectedItem.ID}/${file.name}`,
                                      file
                                    );
                                  if (error) {
                                    console.error(
                                      "Error uploading file:",
                                      error
                                    );
                                  } else {
                                    console.log(
                                      "File uploaded successfully:",
                                      data
                                    );
                                    getFiles();
                                  }
                                }
                              };
                              fileInput.click();
                            }}
                          >
                            Attach
                          </Button>
                        </div>

                        <div className="flex flex-wrap my-3">
                          {files.map((file, index) => (
                            <div
                              key={index}
                              className="w-1/2 flex justify-center my-1"
                            >
                              <Button
                                key={file.name}
                                className="text-overflow-ellipsis w-full mx-2"
                                startContent={
                                  <Icon
                                    className="text-black z-50"
                                    icon="solar:close-circle-bold"
                                    width={25}
                                    onClick={async (e) => {
                                      e.target.closest("button").style.display =
                                        "none";
                                      const lastSelectedKey = Number(
                                        Array.from(selectedKeys).pop()
                                      );
                                      const selectedItem = items.find(
                                        (item) => item.id === lastSelectedKey
                                      );
                                      const fileName = e.target
                                        .closest("button")
                                        .textContent.trim();
                                      const { error } = await supabase.storage
                                        .from("assets")
                                        .remove([
                                          `uploads/${selectedItem.ID}/${fileName}`,
                                        ]);
                                      if (error) {
                                        console.error(
                                          "Error deleting file:",
                                          error
                                        );
                                      } else {
                                        console.log(
                                          "File deleted successfully"
                                        );
                                      }
                                    }}
                                  />
                                }
                                onClick={getDownload}
                              >
                                <p className="w-full overflow-ellipsis overflow-hidden whitespace-nowrap">
                                  {file.name}
                                </p>
                              </Button>
                            </div>
                          ))}
                        </div>
                        <div></div>
                      </div>

                      <Button
                        color="success"
                        onPress={() => {
                          addSelectedItems();
                          setModalType("complete");
                          changeInfos();
                          getInfos()
                        }}
                      >
                        수정하기
                      </Button>
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
                  {modalType === "error" && (
                    <>
                      <p>확인하실 항목을 선택해주세요</p>
                    </>
                  )}
                </ModalBody>
                <ModalFooter className="flex">
                  <Button
                    className="w-full"
                    color=""
                    variant="light"
                    onPress={onClose}
                  >
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
                  {prevModalType === "view" && <p>수정이 완료되었습니다.</p>}
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
