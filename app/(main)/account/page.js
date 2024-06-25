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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {useRouter} from 'next/navigation'
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
  {
    key: "활동로그",
    label: "활동로그",
  },
];

export default function App() {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterLoading1, setFilterLoading1] = useState(false);
  const [companyNames, setCompanyNames] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modalType, setModalType] = useState("");
  const [prevModalType, setPrevModalType] = useState("");
  const [changeCompanyName, setChangeCompanyName] = useState("");
  const [changeStaffName, setChangeStaffName] = useState("");
  const [changeCustomerId, setChangeCustomerId] = useState("");
  const [changeCustomerPw, setChangeCustomerPw] = useState("");
  const [changeCustomerPhoneNo, setChangeCustomerPhoneNo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const [items, setItems] = useState([]);

  const supabase = createClient();
  const router = useRouter();
  const getItems = async () => {
    const itemsPerPage = 20;
    const offset = (currentPage - 1) * itemsPerPage;
    let {
      data: account,
      error,
      count,
    } = selectedCompanyName && selectedCompanyName !== "전체"
      ? searchKeyword
        ? await supabase
            .from("account")
            .select("*", { count: "exact" })
            .eq("companyName", selectedCompanyName)
            .or(
              `staffName.ilike.%${searchKeyword}%,customerId.ilike.%${searchKeyword}%,customerPhoneNo.ilike.%${searchKeyword}%`
            )
            .range(offset, offset + itemsPerPage - 1)
            .order("created_at", { ascending: false })

        : await supabase
            .from("account")
            .select("*", { count: "exact" })
            .eq("companyName", selectedCompanyName)
            .range(offset, offset + itemsPerPage - 1)
            .order("created_at", { ascending: false })

      : searchKeyword
      ? await supabase
          .from("account")
          .select("*", { count: "exact" })
          .or(
            `companyName.ilike.%${searchKeyword}%,staffName.ilike.%${searchKeyword}%,customerId.ilike.%${searchKeyword}%,customerPhoneNo.ilike.%${searchKeyword}%`
          )
          .range(offset, offset + itemsPerPage - 1)
          .order("created_at", { ascending: false })

      : await supabase
          .from("account")
          .select("*", { count: "exact" })
          .range(offset, offset + itemsPerPage - 1)
          .order("created_at", { ascending: false })


    if (!error) {
      setTotalPages(Math.ceil(count / itemsPerPage));
    }
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
  };

  const getFilter1 = async () => {
    let { data: account, error } = await supabase.from("account").select("*");
    if (error) {
      console.log(error);
    } else {
      const companyNames = [
        { key: -1, label: "전체" },
        ...account.reduce((acc, item, index) => {
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

  useEffect(() => {
    getFilter1();
    getItems();
  }, [selectedCompanyName, currentPage]);

  useEffect(() => {
    if (selectedKeys) {
      const lastSelectedKey = Array.from(selectedKeys).map(Number).pop();
      const selectedItem = items.find((item) => item.id === lastSelectedKey);

      if (selectedItem) {
        setChangeCompanyName(selectedItem.companyName);
        setChangeStaffName(selectedItem.staffName);
        setChangeCustomerId(selectedItem.customerId);
        setChangeCustomerPw(selectedItem.customerPw);
        setChangeCustomerPhoneNo(selectedItem.customerPhoneNo);
      }
    }
  }, [selectedKeys]);

  const addSelectedItems = async () => {
    const { data, error } = await supabase
      .from("account")
      .insert([
        {
          companyName: changeCompanyName,
          staffName: changeStaffName,
          customerId: changeCustomerId,
          customerPw: changeCustomerPw,
          customerPhoneNo: changeCustomerPhoneNo,
        },
      ])
      .select();

    if (error) {
      console.log(error);
    } else {
      console.log("Add successfully");
      getItems();
      getFilter1();
      onOpen();
    }
  };

  const changeSelectedItems = async () => {
    const lastSelectedKey = Array.from(selectedKeys).map(Number).pop();
    const { data, error } = await supabase
      .from("account")
      .update({
        companyName: changeCompanyName,
        staffName: changeStaffName,
        customerId: changeCustomerId,
        customerPw: changeCustomerPw,
        customerPhoneNo: changeCustomerPhoneNo,
      })
      .eq("id", lastSelectedKey)
      .select();
    if (error) {
      console.log(error);
    } else {
      console.log("Update successfully");
      getItems();
      getFilter1();
      setSelectedKeys([]);
    }
  };

  const deleteSelectedItems = async () => {
    if (selectedKeys && selectedKeys.size > 0) {
      const idsToDelete = Array.from(selectedKeys).map(Number);

      const { error } = await supabase
        .from("account")
        .delete()
        .in("id", idsToDelete);

      if (error) {
        console.log("Error deleting items:", error);
      } else {
        console.log("Delete successfully");
        // Optionally, refresh the items list after deletion
        getItems();
        getFilter1();
        setSelectedKeys([]);
      }
    } else {
      console.log("No items selected for deletion.");
    }
  };

  console.log('items:',items)

  return (
    <>
      <div className="px-[20vw] py-[5vh] ">
        <div className="mb-5">
          <div>
            <h2 className="font-bold mb-3">고객사 계정 관리</h2>
          </div>
          <div className="flex w-full gap-x-2 justify-between">
            <div className="flex gap-x-2 w-1/4">
              {filterLoading1 ? (
                <>
                  <Select
                    items={companyNames}
                    placeholder="고객사 선택하기"
                    className="w-full"
                    defaultSelectedKeys={[-1]}
                  >
                    {(company) => (
                      <SelectItem
                        onClick={() => {
                          setSelectedCompanyName(company.label);
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
            <Button color="default" onClick={()=>{
              const lastSelectedKey = Array.from(selectedKeys).map(String).pop();
              if (lastSelectedKey) {
                router.push(`/account/${lastSelectedKey}`);
              }
            }}>
              권한설정
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
                  {modalType === "add" && "고객사 계정 추가"}
                  {modalType === "edit" && "고객사 계정 수정"}
                  {modalType === "delete" && "고객사 계정 삭제"}
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
                        label="담당자명"
                        placeholder="담당자명"
                        value={changeStaffName}
                        onChange={(e) => setChangeStaffName(e.target.value)}
                      />
                      <Input
                        type="text"
                        label="고객사ID"
                        placeholder="고객사ID"
                        value={changeCustomerId}
                        onChange={(e) => setChangeCustomerId(e.target.value)}
                      />
                      <Input
                        type="text"
                        label="고객사PW"
                        placeholder="고객사PW"
                        value={changeCustomerPw}
                        onChange={(e) => setChangeCustomerPw(e.target.value)}
                      />
                      <Input
                        type="text"
                        label="연락처"
                        placeholder="연락처"
                        value={changeCustomerPhoneNo}
                        onChange={(e) =>
                          setChangeCustomerPhoneNo(e.target.value)
                        }
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
                        label="담당자명"
                        placeholder="담당자명"
                        value={changeStaffName}
                        onChange={(e) => setChangeStaffName(e.target.value)}
                      />
                      <Input
                        type="text"
                        label="고객사ID"
                        placeholder="고객사ID"
                        value={changeCustomerId}
                        onChange={(e) => setChangeCustomerId(e.target.value)}
                      />
                      <Input
                        type="text"
                        label="고객사PW"
                        placeholder="고객사PW"
                        value={changeCustomerPw}
                        onChange={(e) => setChangeCustomerPw(e.target.value)}
                      />
                      <Input
                        type="text"
                        label="연락처"
                        placeholder="연락처"
                        value={changeCustomerPhoneNo}
                        onChange={(e) =>
                          setChangeCustomerPhoneNo(e.target.value)
                        }
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
    </>
  );
}
