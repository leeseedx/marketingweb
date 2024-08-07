"use client";
import React, { useCallback } from "react";
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
import { useRouter } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createSupabaseClient(supabaseURL, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onOpenChange: onOpenChange1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
  } = useDisclosure();
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onOpenChange: onOpenChange3,
  } = useDisclosure(); //로그보기
  const [filterLoading1, setFilterLoading1] = useState(false);
  const [companyNames, setCompanyNames] = useState([]);
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
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
  const [errorText, setErrorText] = useState("");
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const supabase = createClient();
  const router = useRouter();

  const getLogs = async (emailAccount) => {
    if (emailAccount) {
      const { data: logs, error } = await supabase
        .from("activitylog")
        .select("*")
        .eq("account", emailAccount);

      if (error) {
        console.error("Error fetching logs:", error.message);
      } else {
        setLogs(logs);
        console.log("Logs fetched successfully:", logs);
      }
    } else {
      console.log("User email is not available.");
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("user:", user);
      if (!user) {
        window.location.href = "/login";
      }
      if (user.id !== "cb1d1d38-ca7b-429a-8db5-770cd9085644") {
        window.location.href = "/?error=관리자만 접속 가능한 페이지입니다.";
      }
      setUser(user);
    };
    checkUser();
  }, []);

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
          .order("created_at", { ascending: false });

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
    if (selectedKeys && items.length > 0) {
      const lastSelectedKey = Array.from(selectedKeys).pop();
      const selectedItem = items.find(
        (item) => String(item.id) === String(lastSelectedKey)
      );
      if (selectedItem) {
        setSelectedItem(selectedItem);
      }
    }
  }, [selectedKeys]);

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
    const { data: dataSignup, error: errorSignup } =
      await supabaseAdmin.auth.admin.createUser({
        email: changeCustomerId,
        password: changeCustomerPw,
        email_confirm: true,

      });

    if (errorSignup) {
      console.log(errorSignup);
    }

    const { data, error } = await supabase
      .from("account")
      .insert([
        {
          companyName: changeCompanyName,
          staffName: changeStaffName,
          customerId: changeCustomerId,
          customerPhoneNo: changeCustomerPhoneNo,
          userId: dataSignup.user.id,
        },
      ])
      .select();

    if (error) {
      console.log(error);
    } else {
      console.log("Add successfully");
      getItems();
      getFilter1();
      onOpen1();
    }
  };

  const changeSelectedItems = async () => {
    const lastSelectedKey = Array.from(selectedKeys).map(Number).pop();
    const user = "";
    if (changeCustomerPw) {
      const { data: user, error } =
        await supabaseAdmin.auth.admin.updateUserById(selectedItem.userId, {
          password: changeCustomerPw,
        });
      console.log("userChange:", user);
      setChangeCustomerPw("");
    }

    const { data, error } = await supabase
      .from("account")
      .update({
        companyName: changeCompanyName,
        staffName: changeStaffName,
        customerId: changeCustomerId,
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

  const handleTest = async () => {
    const {
      data: { users },
      error,
    } = await supabaseAdmin.auth.admin.listUsers();
    console.log("users:", users, error);
  };

  const deleteSelectedItems = async () => {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
      selectedItem.userId
    );

    if (selectedKeys && selectedKeys.size > 0) {
      const idsToDelete = Array.from(selectedKeys).map(Number);
      const { error: error2 } = await supabase
        .from("authProject")
        .delete()
        .in("accountId", idsToDelete);

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

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "활동로그":
        return (
          <Button
            variant="bordered"
            onClick={() => {
              onOpen3();
              getLogs(user.고객사ID);
            }}
          >
            보기
          </Button>
        );
      default:
        return cellValue;
    }
  }, []);

  console.log("logs:", logs);

  return (
    <>
      <div className="md:px-[20vw] px-[5vw] py-[5vh]">
        <div className="mb-5">
          <div>
            <h2 className="font-bold mb-3">고객사 계정 관리</h2>
          </div>
          <div className="flex flex-col md:flex-row w-full gap-x-2 justify-between gap-y-2">
            <div className="flex gap-x-2 w-full md:w-1/4">
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
                  <TableCell className="text-center">
                    {renderCell(item, columnKey)}
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
        <div className="flex justify-center items-center md:justify-end">
          <div className="grid grid-cols-2 md:flex gap-2">
            <Button
              color="danger"
              radius="md"
              onPress={() => {
                setModalType("delete");
                setPrevModalType("delete");
                onOpen1();
              }}
            >
              삭제
            </Button>

            <Button
              color="default"
              onClick={() => {
                const lastSelectedKey = Array.from(selectedKeys)
                  .map(String)
                  .pop();
                if (lastSelectedKey) {
                  router.push(`/account/${lastSelectedKey}`);
                }
              }}
            >
              권한설정
            </Button>
            <Button
              color="success"
              radius="md"
              onPress={() => {
                setModalType("edit");
                setPrevModalType("edit");
                onOpen1();
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
                onOpen1();
              }}
            >
              추가
            </Button>
          </div>
        </div>
      </div>
      {modalType !== "complete" && (
        <Modal isOpen={isOpen1} onOpenChange={onOpenChange1}>
          <ModalContent>
            {(onClose1) => (
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
                        label="고객사ID(이메일형태로 입력해주세요)"
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
                      <h2 className="font-bold">기본정보</h2>
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
                        label="연락처"
                        placeholder="연락처"
                        value={changeCustomerPhoneNo}
                        onChange={(e) =>
                          setChangeCustomerPhoneNo(e.target.value)
                        }
                      />
                      <h2 className="font-bold">로그인 정보</h2>
                      <Input
                        type="email"
                        label="고객사ID"
                        placeholder="고객사ID"
                        value={changeCustomerId}
                        onChange={(e) => setChangeCustomerId(e.target.value)}
                        disabled
                      />
                      <Input
                        type="email"
                        label="고객사PW"
                        placeholder="고객사PW"
                        value={changeCustomerPw}
                        onChange={(e) => setChangeCustomerPw(e.target.value)}
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
                  <Button color="" variant="light" onPress={onClose1}>
                    닫기
                  </Button>
                  {modalType === "add" && (
                    <Button
                      className="bg-[#b12928] text-white"
                      onPress={() => {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(changeCustomerId)) {
                          onOpen2();
                          setErrorText("아이디를 이메일형태로 입력해주세요");
                        } else {
                          addSelectedItems();
                          setModalType("complete");
                        }
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
          isOpen={isOpen1}
          onOpenChange={onOpenChange1}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            {(onClose1) => (
              <>
                <ModalBody className="flex p-5">
                  {prevModalType === "add" && <p>저장 되었습니다.</p>}
                  {prevModalType === "edit" && <p>수정이 완료되었습니다.</p>}
                  {prevModalType === "delete" && <p>삭제 되었습니다.</p>}
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-[#b12928] text-white"
                    onPress={onClose1}
                  >
                    확인
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <Modal
        isOpen={isOpen2}
        onOpenChange={onOpenChange2}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose2) => (
            <>
              <ModalBody className="flex p-5">{errorText}</ModalBody>
              <ModalFooter>
                <Button className="bg-[#b12928] text-white" onPress={onClose2}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpen3}
        onOpenChange={onOpenChange3}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose3) => (
            <>
              <ModalBody className="flex p-10">
                <Table
                  className="w-full overflow-y-auto h-[50vh]"
                  removeWrapper
                >
                  <TableHeader>
                    <TableColumn>활동일시</TableColumn>
                    <TableColumn>내용</TableColumn>
                    
                  </TableHeader>
                  <TableBody>
                    {logs.map((log,index)=>(
                      <TableRow key={log.index}>
                        <TableCell>{new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 19)}</TableCell>
                        <TableCell>{log.action}</TableCell>
                      </TableRow>
                    ))}
                    


                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#b12928] text-white" onPress={onClose3}>
                  확인
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
