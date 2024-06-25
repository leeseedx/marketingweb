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
  Spinner,
} from "@nextui-org/react";
import { users } from "./components/data";
import { animals } from "./components/data";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { Icon } from "@iconify/react";

const columns = [
  {
    key: "분류",
    label: "분류",
  },
  {
    key: "Week",
    label: "Week",
  },
  {
    key: "Product",
    label: "Product",
  },
  {
    key: "Target",
    label: "Target",
  },
  {
    key: "Keyword or Context",
    label: "Keyword or Context",
  },
  {
    key: "Keyword Challenge",
    label: "Keyword Challenge",
  },
  {
    key: "Interest",
    label: "Interest",
  },
  {
    key: "Type",
    label: "Type",
  },
  {
    key: "ID",
    label: "ID",
  },
  {
    key: "Name",
    label: "Name",
  },
  {
    key: "URL",
    label: "URL",
  },
  {
    key: "Visitor or Follower",
    label: "Visitor or Follower",
  },
  {
    key: "Creation cost",
    label: "Creation cost",
  },
  {
    key: "2nd Usage",
    label: "2nd Usage",
  },
  {
    key: "Mirroring",
    label: "Mirroring",
  },
  {
    key: "Title",
    label: "Title",
  },
  {
    key: "Contents URL",
    label: "Contents URL",
  },
  {
    key: "Views",
    label: "Views",
  },
  {
    key: "Like",
    label: "Like",
  },
  {
    key: "Comment",
    label: "Comment",
  },
  {
    key: "비고",
    label: "비고",
  },
  {
    key: "URL with Parameter",
    label: "URL with Parameter",
  },
  {
    key: "URL Shorten",
    label: "URL Shorten",
  },
  {
    key: "logger code",
    label: "logger code",
  },
  {
    key: "이메일",
    label: "이메일",
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
    key: "우편번호",
    label: "우편번호",
  },
  {
    key: "주소",
    label: "주소",
  },
  {
    key: "배송시 특이사항",
    label: "배송시 특이사항",
  },
  {
    key: "택배사",
    label: "택배사",
  },
  {
    key: "송장번호",
    label: "송장번호",
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
  const [totalPages, setTotalPages] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modalType, setModalType] = useState("");
  const [changeCompanyName, setChangeCompanyName] = useState("");
  const [changeProjectName, setChangeProjectName] = useState("");
  const [prevModalType, setPrevModalType] = useState("");
  const [checkedInfos, setCheckedInfos] = useState(null);

  // const items=[{
  //   id: 1,
  //   생성일자: "2021-01-01",
  //   고객사명: "고객사명",
  //   프로젝트명: "프로젝트명",
  // }]
  const supabase = createClient();

  const getItems = async () => {
    const itemsPerPage = 20;
    const offset = (currentPage - 1) * itemsPerPage;
    let {
      data: registerItems,
      error,
      count,
    } = selectedCompanyName && selectedCompanyName !== "전체"
      ? selectedProjectName && selectedProjectName !== "전체"
        ? await supabase
            .from("registerItems")
            .select("*", { count: "exact" })
            .eq("companyName", selectedCompanyName)
            .eq("projectName", selectedProjectName)
            .or(
              `companyName.ilike.%${searchKeyword}%,projectName.ilike.%${searchKeyword}%`
            )
            .order("created_at", { ascending: false })
            .range(offset, offset + itemsPerPage - 1)
        : await supabase
            .from("registerItems")
            .select("*", { count: "exact" })
            .eq("companyName", selectedCompanyName)
            .or(
              `companyName.ilike.%${searchKeyword}%,projectName.ilike.%${searchKeyword}%`
            )
            .order("created_at", { ascending: false })
            .range(offset, offset + itemsPerPage - 1)
      : searchKeyword
      ? await supabase
          .from("registerItems")
          .select("*", { count: "exact" })
          .or(
            `companyName.ilike.%${searchKeyword}%,projectName.ilike.%${searchKeyword}%`
          )
          .order("created_at", { ascending: false })
          .range(offset, offset + itemsPerPage - 1)
      : await supabase
          .from("registerItems")
          .select("*", { count: "exact" })
          .range(offset, offset + itemsPerPage - 1)
          .order("created_at", { ascending: false });

    console.log("registerItems", registerItems);
    if (!error) {
      setTotalPages(Math.ceil(count / itemsPerPage));
    }
    if (error) {
      console.log(error);
    } else {
      const formattedProject = registerItems.map((item) => ({
        ...item,
        생성일자: item.created_at,
        고객사명: item.companyName,
        프로젝트명: item.projectName,
      }));

      setItems(formattedProject);
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
  const getFilter2 = async (companyName) => {
    let { data: project, error } = await supabase
      .from("project")
      .select("*")
      .eq("companyName", companyName);
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
    getFilter2(selectedCompanyName);
    getItems();
  }, [selectedCompanyName, selectedProjectName, currentPage]);

  console.log("projectNames", projectNames);
  console.log("selectedCompanyName", selectedCompanyName);

  const getInfos = () => {
    const lastSelectedKey = Array.from(selectedKeys).pop();
    const selectedItem = items.find(
      (item) => String(item.id) === String(lastSelectedKey)
    );

    if (selectedItem) {
      const matchedItem = items.find(
        (item) => String(item.id) === String(selectedItem.id)
      );
      if (matchedItem) {
        setCheckedInfos(matchedItem);
      } else {
        console.log("No matching item found.");
      }
    } else {
      console.log("No item selected.");
    }
  };

  console.log("items", items);
  console.log("selectedKeys", selectedKeys);

  return (
    <>
      <div className="px-[20vw] py-[5vh] ">
        <div className="mb-5">
          <div>
            <h2 className="font-bold mb-3">인플루언서 리스트</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-2  w-1/3">
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
                        getFilter2(company.label);
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
            {selectedCompanyName && (
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
                      setCurrentPage(1);
                    }}
                  >
                    {project.label}
                  </SelectItem>
                )}
              </Select>
            )}
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
        <div>
          <Table
            aria-label="Controlled table example with dynamic content"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            className="w-full"
            classNames={{
              base: " overflow-scroll",
              table: "",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn className="w-1/10 text-center" key={column.key}>
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={items}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell className="w-1/10 text-center">
                      {getKeyValue(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-center items-center my-5">
            {totalPages ? (
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
            ) : (
              <Spinner></Spinner>
            )}
          </div>
        </div>
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
            <Button
              color="primary"
              radius="md"
              onPress={() => {
                if (selectedKeys.size === 0) {
                  setModalType("error");
                  setPrevModalType("error");
                  onOpen();
                } else {
                  setModalType("view");
                  setPrevModalType("view");
                  onOpen();
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
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
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
                    <div className="flex flex-col gap-2">
                      <div>
                        <h3 className="font-bold">분류</h3>
                      </div>
                      <Input
                        className="col-span-1"
                        type="text"
                        label="분류"
                        placeholder="분류"
                        value={checkedInfos.분류}
                        onChange={(e) =>
                          setCheckedInfos({
                            ...checkedInfos,
                            분류: e.target.value,
                          })
                        }
                      />
                      <div>
                        <h3 className="font-bold">프로젝트 정보</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Week"
                          placeholder="Week"
                          value={checkedInfos.Week}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Week: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="text"
                          label="Product"
                          placeholder="Product"
                          value={checkedInfos.Product}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Product: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">마케팅 정보</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Target"
                          placeholder="Target"
                          value={checkedInfos.Target}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Target: e.target.value,
                            })
                          }
                        />

                        <Input
                          className="col-span-1"
                          type="text"
                          label="Keyword or Context"
                          placeholder="Keyword or Context"
                          value={checkedInfos["Keyword or Context"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              "Keyword or Context": e.target.value,
                            })
                          }
                        />
                        <Input
                          type="text"
                          label="Interest"
                          placeholder="Interest"
                          value={checkedInfos.Interest}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Interest: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="text"
                          label="Keyword Challenge"
                          placeholder="Keyword Challenge"
                          value={checkedInfos["Keyword Challenge"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              "Keyword Challenge": e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">인플루언서 정보</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Type"
                          placeholder="Type"
                          value={checkedInfos.Type}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Type: e.target.value,
                            })
                          }
                        />
                        <Input
                          className="col-span-1"
                          type="text"
                          label="ID"
                          placeholder="ID"
                          value={checkedInfos.ID}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              ID: e.target.value,
                            })
                          }
                        />
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Name"
                          placeholder="Name"
                          value={checkedInfos.Name}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="URL"
                          placeholder="URL"
                          value={checkedInfos.URL}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              URL: e.target.value,
                            })
                          }
                        />
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Visitor or Follower"
                          placeholder="Visitor or Follower"
                          value={checkedInfos["Visitor or Follower"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              "Visitor or Follower": e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">비용 정보</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Creation cost"
                          placeholder="Creation cost"
                          value={checkedInfos["Creation cost"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              "Creation cost": e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="2nd Usage"
                          placeholder="2nd Usage"
                          value={checkedInfos["2nd Usage"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              "2nd Usage": e.target.value,
                            })
                          }
                        />
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Mirroring"
                          placeholder="Mirroring"
                          value={checkedInfos["Mirroring"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Mirroring: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">컨텐츠 정보</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Title"
                          placeholder="Title"
                          value={checkedInfos["Title"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Title: e.target.value,
                            })
                          }
                        />
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Contents URL"
                          placeholder="Contents URL"
                          value={checkedInfos["Contents URL"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              "Contents URL": e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Views"
                          placeholder="Views"
                          value={checkedInfos.Views}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Views: e.target.value,
                            })
                          }
                        />
                        <Input
                          className="col-span-1"
                          type="text"
                          label="like"
                          placeholder="like"
                          value={checkedInfos.like}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              like: e.target.value,
                            })
                          }
                        />
                        <Input
                          className="col-span-1"
                          type="text"
                          label="Comment"
                          placeholder="Comment"
                          value={checkedInfos.Comment}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              Comment: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="비고"
                          placeholder="비고"
                          value={checkedInfos["비고"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              비고: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">트래킹 정보</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="URL with Parameter"
                          placeholder="URL with Parameter"
                          value={checkedInfos["URL with Parameter"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              "URL with Parameter": e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          className="col-span-1"
                          type="text"
                          label="URL Shorten"
                          placeholder="URL Shorten"
                          value={checkedInfos["URL Shorten"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              "URL Shorten": e.target.value,
                            })
                          }
                        />
                        <Input
                          className="col-span-1"
                          type="text"
                          label="logger code"
                          placeholder="logger code"
                          value={checkedInfos["logger code"]}
                          onChange={(e) =>
                            setCheckedInfos({
                              ...checkedInfos,
                              "logger code": e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <h3 className="font-bold">기타 상세 정보</h3>
                      </div>
                      <Button
                        color="success"
                        onPress={() => {
                          addSelectedItems();
                          setModalType("complete");
                          changeInfos();
                        }}
                      >
                        수정하기
                      </Button>
                    </div>
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
