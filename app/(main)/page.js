"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import * as XLSX from "xlsx";
import { Pagination } from "@nextui-org/react";
import { Select, SelectItem, Skeleton, Tooltip } from "@nextui-org/react";
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
import { RadioGroup, Radio } from "@nextui-org/react";

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
const variations = [
  {
    key: "전체",
    label: "전체",
  },
  {
    key: "승인",
    label: "승인",
  },
  {
    key: "드롭",
    label: "드롭",
  },
  {
    key: "홀드",
    label: "홀드",
  },
  {
    key: "미지정",
    label: "미지정",
  },
];
const userTypes = [
  {
    key: "전체",
    label: "전체",
  },
  {
    key: "insta-influencer",
    label: "insta-influencer",
  },
  {
    key: "N-bloger",
    label: "N-bloger",
  },
  {
    key: "N-influencer",
    label: "N-influencer",
  },
];
const sortings = [
  {
    key: "등록순",
    label: "등록순",
  },
  {
    key: "방문자순",
    label: "방문자순",
  },
  {
    key: "좋아요순",
    label: "좋아요순",
  },
  {
    key: "댓글순",
    label: "댓글순",
  },
  {
    key: "타겟",
    label: "타겟",
  },
  {
    key: "제품명(오름차순)",
    label: "제품명(오름차순)",
  },
  {
    key: "제품명(내림차순)",
    label: "제품명(내림차순)",
  },
];
const searchFilters = [
  {
    key: "제품명",
    label: "제품명",
  },
  {
    key: "키워드",
    label: "키워드",
  },
  {
    key: "이름",
    label: "이름",
  },
  {
    key: "이메일",
    label: "이메일",
  },
  {
    key: "연락처",
    label: "연락처",
  },
  {
    key: "주소",
    label: "주소",
  },
  {
    key: "송장번호",
    label: "송장번호",
  },
];
const columns1 = [
  {
    key: "분류",
    label: "분류",
  },
  {
    key: "고객사명",
    label: "고객사명",
  },
  {
    key: "프로젝트명",
    label: "프로젝트명",
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
    key: "like",
    label: "like",
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
    key: "배송메모",
    label: "배송메모",
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
const columns2 = [
  {
    key: "분류",
    label: "분류",
  },
  {
    key: "고객사명",
    label: "고객사명",
  },
  {
    key: "프로젝트명",
    label: "프로젝트명",
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
    key: "like",
    label: "like",
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
  // {
  //   key: "이메일",
  //   label: "이메일",
  // },
  // {
  //   key: "이름",
  //   label: "이름",
  // },
  // {
  //   key: "연락처",
  //   label: "연락처",
  // },
  // {
  //   key: "우편번호",
  //   label: "우편번호",
  // },
  // {
  //   key: "주소",
  //   label: "주소",
  // },
  // {
  //   key: "배송메모",
  //   label: "배송메모",
  // },
  // {
  //   key: "택배사",
  //   label: "택배사",
  // },
  // {
  //   key: "송장번호",
  //   label: "송장번호",
  // },
  // {
  //   key: "은행",
  //   label: "은행",
  // },
  // {
  //   key: "예금주",
  //   label: "예금주",
  // },
  // {
  //   key: "계좌번호",
  //   label: "계좌번호",
  // },
  // {
  //   key: "계약비용",
  //   label: "계약비용",
  // },
];

const typeList = [
  {
    key: "insta-influencer",
    label: "insta-influencer",
  },
  {
    key: "N-bloger",
    label: "N-bloger",
  },
  {
    key: "N-influencer",
    label: "N-influencer",
  },
];

export default function App() {
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onOpenChange: onOpenChange1,
  } = useDisclosure(); // 수정,추가 모달
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onOpenChange: onOpenChange2,
  } = useDisclosure(); // ??
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onOpenChange: onOpenChange3,
  } = useDisclosure(); // 체크 입력 안한 에러
  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onOpenChange: onOpenChange4,
  } = useDisclosure();
  const {
    isOpen: isOpen5,
    onOpen: onOpen5,
    onOpenChange: onOpenChange5,
  } = useDisclosure(); // 엑셀 사전 등록
  const {
    isOpen: isOpen6,
    onOpen: onOpen6,
    onOpenChange: onOpenChange6,
  } = useDisclosure(); // 제외하고 등록
  const {
    isOpen: isOpen7,
    onOpen: onOpen7,
    onOpenChange: onOpenChange7,
  } = useDisclosure(); // 엑셀 추가 등록
  const {
    isOpen: isOpen8,
    onOpen: onOpen8,
    onOpenChange: onOpenChange8,
  } = useDisclosure(); // 제외하고 등록
  const {
    isOpen: isOpen9,
    onOpen: onOpen9,
    onOpenChange: onOpenChange9,
  } = useDisclosure(); // 관리자만 접속 페이지
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
  const [checkedInfos, setCheckedInfos] = useState({ 분류: "미지정" });
  const [files, setFiles] = useState([]);
  const [prevData, setPrevData] = useState([]);
  const [downloadType, setDownloadType] = useState("현재페이지");
  const [errorText, setErrorText] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [excelFile, setExcelFile] = useState(null);
  const [errorRowList, setErrorRowList] = useState([]);
  const [user, setUser] = useState(null);
  const [isMaster, setIsMaster] = useState(true);
  const [columns, setColumns] = useState([]);
  const [errorText2, setErrorText2] = useState("");
  const [isPossible, setIsPossible] = useState(false);
  const [session, setSession] = useState(null);
  const [isInvalid, setIsInvalid] = useState({
    "Visitor or Follower": true,
    고객사명: true,
    프로젝트명: true,
    Week: true,
    Product: true,
    Target: true,
    "Keyword or Context": true,
    Interest: true,
    "Keyword Challenge": true,
    Type: true,
    ID: true,
    Name: true,
    URL: true,
    "Visitor or Follower": true,
  });

  // 필터값들
  const [units, setUnits] = useState(15);
  const [filterVariation, setFilterVariation] = useState("전체");
  const [filterType, setFilterType] = useState("전체");
  const [sorting, setSorting] = useState("등록순");
  const [filterSearch, setFilterSearch] = useState("제품명");
  const supabase = createClient();


  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
    
  };

  useEffect(() => {
    getSession();
  }, []);

  console.log('session:',session)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("error")) {
      onOpen9();
    }
  }, []);

  useEffect(() => {
    if (isMaster) {
      setColumns(columns1);
    } else {
      setColumns(columns2);
    }
  }, [isMaster]);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("user:", user);
      if (!user) {
        window.location.href = "/login";
      }
      setUser(user);
      if (user.id !== "cb1d1d38-ca7b-429a-8db5-770cd9085644") {
        setIsMaster(false);
        let { data: account, error } = await supabase
          .from("account")
          .select("*") // Filters
          .eq("customerId", user?.email)
          .single();
        setSelectedCompanyName(account?.companyName);
      }
    };
    checkUser();
  }, []);

  const getItems = async () => {
    const itemsPerPage = units;
    const offset = (currentPage - 1) * units;

    let query = supabase.from("registerItems").select("*", { count: "exact" });

    // 조건에 따라 쿼리 구성
    if (selectedCompanyName && selectedCompanyName !== "전체") {
      query = query.eq("고객사명", selectedCompanyName);
    }

    if (selectedProjectName && selectedProjectName !== "전체") {
      query = query.eq("프로젝트명", selectedProjectName);
    }
    if (filterVariation && filterVariation !== "전체") {
      query = query.eq("분류", filterVariation);
    }
    if (filterType && filterType !== "전체") {
      query = query.eq("Type", filterType);
    }

    if (searchKeyword) {
      let columnName = "";
      if (filterSearch === "제품명") {
        columnName = "Product";
      } else if (filterSearch === "키워드") {
        columnName = "Keyword of Context";
      } else if (filterSearch === "이름") {
        columnName = "Name";
      } else if (filterSearch === "이메일") {
        columnName = "이메일";
      } else if (filterSearch === "연락처") {
        columnName = "연락처";
      } else if (filterSearch === "주소") {
        columnName = "주소";
      } else if (filterSearch === "송장번호") {
        columnName = "송장번호";
      }

      query = query.or(`${columnName}.ilike.%${searchKeyword}%`);
      console.log("query:", query);
    } else {
      query = query;
    }

    //소팅방법 변경
    if (sorting && sorting === "등록순") {
      query = query.order("생성일자", { ascending: false });
    } else if (sorting && sorting === "방문자순") {
      query = query.order("Visitor or Follower", { ascending: false });
    } else if (sorting && sorting === "좋아요순") {
      query = query.order("like", { ascending: false });
    } else if (sorting && sorting === "댓글순") {
      query = query.order("Comment", { ascending: false });
    } else if (sorting && sorting === "타겟") {
      query = query.order("Target", { ascending: false });
    } else if (sorting && sorting === "제품명(오름차순)") {
      query = query.order("Product", { ascending: true });
    } else if (sorting && sorting === "제품명(내림차순)") {
      query = query.order("Product", { ascending: false });
    }

    // 정렬 및 범위 설정

    query = query.range(offset, offset + itemsPerPage - 1);

    console.log("query:", query);
    // 최종 쿼리 실행
    let { data: registerItems, error, count } = await query;

    if (!error) {
      setTotalPages(Math.ceil(count / itemsPerPage));
    }
    if (error) {
      console.log(error);
    } else {
      setItems(registerItems);
    }
  };

  const getFilter1 = async () => {
    let { data: project, error } = await supabase.from("project").select("*");
    if (error) {
      console.log(error);
    } else {
      const companyNames = [
        { key: "전체", label: "전체" },
        ...project.reduce((acc, item, index) => {
          if (!acc.some(({ label }) => label === item.companyName)) {
            acc.push({ key: item.companyName, label: item.companyName });
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
  }, []);

  useEffect(() => {
    getFilter2(selectedCompanyName);
  }, [selectedCompanyName, selectedProjectName]);

  useEffect(() => {
    if (isPossible) {
      getItems();
    }
  }, [currentPage, units, filterVariation, filterType, sorting]);

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
  const getFiles = async () => {
    if (true) {
      const { data, error } = await supabase.storage
        .from("assets")
        .list(`uploads/${checkedInfos?.ID}`);

      if (error) {
        console.error("Error listing files:", error);
      } else {
        setFiles(data);
        console.log("Files in project folder:", data);
      }
    } else {
      console.log("No item selected.");
    }
  };
  // };
  const getDownload = async (e) => {
    if (true) {
      const fileName = e.target.closest("button").textContent.trim();
      const { data, error } = await supabase.storage
        .from("assets")
        .download(`uploads/${checkedInfos.ID}/${fileName}`);

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
  const addInfos = async () => {
    console.log("checkedInfos", checkedInfos);
    const { id, ...newCheckedInfos } = checkedInfos;
    const { data, error } = await supabase
      .from("registerItems")
      .insert(newCheckedInfos);
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      getItems();
      setModalType("complete");
    }
  };

  const changeInfos = async () => {
    const lastSelectedKey = Number(Array.from(selectedKeys).pop());
    const { data, error } = await supabase
      .from("registerItems")
      .update(checkedInfos)
      .eq("id", lastSelectedKey);
    if (error) {
      console.log(error);
    } else {
      console.log("change successfully");
      getItems();
      setModalType("complete");
    }
  };
  const deleteInfos = async () => {
    setPrevModalType;
    const lastSelectedKey = Number(Array.from(selectedKeys).pop());
    const { data, error } = await supabase
      .from("registerItems")
      .delete()
      .eq("id", lastSelectedKey);
    if (error) {
      console.log(error);
    } else {
      console.log("delete successfully");
      getItems();
      setModalType("complete");
    }
  };

  const handleDownload = async () => {
    if (downloadType === "전체") {
      let {
        data: registerItems,
        error,
        count,
      } = await supabase
        .from("registerItems")
        .select("*", { count: "exact" })
        .eq("고객사명", selectedCompanyName)
        .order("생성일자", { ascending: false });

      console.log("registerItems", registerItems);
      const fileName = "registerItems.xlsx";

      const changedRegisterItems = registerItems.map(({ id, ...item }) => ({
        생성일자: item.생성일자,
        프로젝트명: item.프로젝트명,
        고객사명: item.고객사명,
        ...item, // 기존 항목의 모든 필드를 포함
      }));

      const worksheet = XLSX.utils.json_to_sheet(changedRegisterItems);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Register Items");
      XLSX.writeFile(workbook, fileName);
    } else if (downloadType === "현재페이지") {
      const offset = (currentPage - 1) * itemsPerPage;
      let {
        data: registerItems,
        error,
        count,
      } = await supabase
        .from("registerItems")
        .select("*", { count: "exact" })
        .eq("고객사명", selectedCompanyName)
        .order("생성일자", { ascending: false })
        .range(offset, offset + itemsPerPage - 1);

      console.log("registerItems", registerItems);
      const fileName = "registerItems.xlsx";

      const changedRegisterItems = registerItems.map(({ id, ...item }) => ({
        생성일자: item.생성일자,
        프로젝트명: item.프로젝트명,
        고객사명: item.고객사명,
        ...item, // 기존 항목의 모든 필드를 포함
      }));

      const worksheet = XLSX.utils.json_to_sheet(changedRegisterItems);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Register Items");
      XLSX.writeFile(workbook, fileName);
    } else if (downloadType === "선택 항목") {
      const selectedIds = Array.from(selectedKeys);
      let {
        data: registerItems,
        error,
        count,
      } = await supabase
        .from("registerItems")
        .select("*", { count: "exact" })
        .eq("고객사명", selectedCompanyName)
        .in("id", selectedIds)
        .order("생성일자", { ascending: false });
      const fileName = "registerItems.xlsx";

      const changedRegisterItems = registerItems.map(({ id, ...item }) => ({
        생성일자: item.생성일자,
        프로젝트명: item.프로젝트명,
        고객사명: item.고객사명,
        ...item, // 기존 항목의 모든 필드를 포함
      }));

      const worksheet = XLSX.utils.json_to_sheet(changedRegisterItems);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Register Items");
      XLSX.writeFile(workbook, fileName);
    }
  };

  const uploadFile = async (resumeFlag) => {
    console.log("업로드실행");
    if (excelFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const exceldata = new Uint8Array(e.target.result);
        const workbook = XLSX.read(exceldata, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const itemsToInsert = jsonData.slice(3).map((row) => ({
          분류: "미지정",
          고객사명: row[0],
          프로젝트명: row[1],
          Week: row[2],
          Product: row[3],
          Target: row[4],
          "Keyword or Context": row[5],
          "Keyword Challenge": row[6],
          Interest: row[7],
          Type: row[8],
          ID: row[9],
          Name: row[10],
          URL: row[11],
          "Visitor or Follower": isNaN(Number(row[12])) ? 0 : Number(row[12]),
        }));
        console.log("itemsToInsert", itemsToInsert);
        const emptyRows = [];
        itemsToInsert.forEach((item, index) => {
          if (
            Object.values(item).some(
              (value) =>
                value === undefined || value.length === 0 || value === null
            )
          ) {
            emptyRows.push({
              rowIndex: index + 4, // Adding 4 because itemsToInsert starts from the 4th row of the Excel file
              Type: "",
              ID: "",
            }); // Adding 4 because itemsToInsert starts from the 4th row of the Excel file
          }
        });
        console.log("emptyRows", emptyRows);
        if (emptyRows.length > 0) {
          const emptyRowsList = Array.from(emptyRows).join(", ");
          setErrorText(`필수 항목이 누락된 데이타가 있습니다.`);
          setErrorRowList(emptyRows);
          onOpen3();
          return;
        }

        // Check for existing Type and ID values
        const existingItems = await supabase
          .from("registerItems")
          .select("Type, ID, 분류");

        const existingTypeIds = new Set(
          existingItems.data
            .filter((item) => item.분류 !== "홀드")
            .map((item) => `${item.Type}-${item.ID}`)
        );
        const duplicateRows = [];
        const nonDuplicateRows = [];
        itemsToInsert.forEach((item, index) => {
          const typeIdKey = `${item.Type}-${item.ID}`;
          if (existingTypeIds.has(typeIdKey)) {
            duplicateRows.push({
              rowIndex: index + 4, // Adding 4 because itemsToInsert starts from the 4th row of the Excel file
              Type: item.Type,
              ID: item.ID,
            });
          } else {
            nonDuplicateRows.push(item);
          }
        });

        if (duplicateRows.length > 0 && resumeFlag == false) {
          console.log("중복있다.");
          setErrorText(
            `이미 등록된 중복값 <span class="text-red-600 font-bold">${duplicateRows.length}</span>건이 있습니다.<br>해당 행을 제외 후 등록하시겠습니까?`
          );
          setErrorRowList(duplicateRows);
          onOpen6();
          return;
        }

        const { data, error } = await supabase
          .from("registerItems")
          .insert(nonDuplicateRows);

        if (error) {
          console.error("Error inserting data:", error);
        } else {
          console.log("Data inserted successfully:", data);
          // onOpenChange6(false);
          // setResumeFlag(false);
          setExcelFile(null);
          onOpenChange5();
          getItems();
          setErrorText("등록이 완료되었습니다.");
          onOpen3();
          setErrorRowList([]);
        }
      };
      reader.readAsArrayBuffer(excelFile);
    }
  };

  const uploadFileMore = async (uploadMode, resumeFlag) => {
    console.log("업로드실행");
    if (excelFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const exceldata = new Uint8Array(e.target.result);
        const workbook = XLSX.read(exceldata, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const itemsToInsert = jsonData.slice(3).map((row) => ({
          고객사명: row[0],
          프로젝트명: row[1],
          Week: row[2],
          Product: row[3],
          Target: row[4],
          "Keyword or Context": row[5],
          "Keyword Challenge": row[6],
          Interest: row[7],
          Type: row[8],
          ID: row[9],
          Name: row[10],
          URL: row[11],
          "Visitor or Follower": row[12],
          "Creation cost": row[13],
          "2nd Usage": row[14],
          Mirroring: row[15],
          Title: row[16],
          "Contents URL": row[17],
          Views: row[18],
          like: isNaN(Number(row[19])) ? 0 : Number(row[19]),
          Comment: isNaN(Number(row[20])) ? 0 : Number(row[20]),
          비고: row[21],
          "URL with Parameter": row[22],
          "URL Shorten": row[23],
          "logger code": row[24],
          이메일: row[25],
          이름: row[26],
          연락처: row[27],
          우편번호: row[28],
          주소: row[29],
          배송메모: row[30],
          택배사: row[31],
          송장번호: row[32],
          은행: row[33],
          예금주: row[34],
          계좌번호: row[35],
          계약비용: row[36],
        }));
        const emptyRows = [];
        itemsToInsert.forEach((item, index) => {
          if (
            item.Type === undefined ||
            item.Type.length === 0 ||
            item.ID === undefined ||
            item.ID.length === 0
          ) {
            emptyRows.push({
              rowIndex: index + 4, // Adding 4 because itemsToInsert starts from the 4th row of the Excel file
              Type: item.Type || "",
              ID: item.ID || "",
            });
          }
        });
        console.log("resumeFlag:", resumeFlag);
        if (emptyRows.length > 0) {
          const emptyRowsList = Array.from(emptyRows).join(", ");
          setErrorText(`필수 항목이 누락된 데이타가 있습니다.`);
          setErrorRowList(emptyRows);
          onOpen3();
          return;
        }

        // Extract ID values from itemsToInsert
        const idList = itemsToInsert.map((item) => item.ID);
        console.log("ID List:", idList);

        // Check for existing Type and ID values
        const { data: existingItems, error: existingItemsError } =
          await supabase.from("registerItems").select("*").in("ID", idList);

        const header_list = [
          "Name",
          "URL",
          "Visitor or Follower",
          "Creation cost",
          "2nd Usage",
          "Mirroring",
          "Title",
          "Contents URL",
          "Views",
          "like",
          "Comment",
          "비고",
          "URL with Parameter",
          "URL Shorten",
          "logger code",
          "이메일",
          "이름",
          "연락처",
          "우편번호",
          "주소",
          "배송메모",
          "택배사",
          "송장번호",
          "은행",
          "예금주",
          "계좌번호",
          "계약비용",
        ];

        console.log("existingItems", existingItems);

        const duplicateRows = [];
        const noDuplicateRows = [];

        existingItems.forEach((item) => {
          // console.log("item",item);
          const hasNonNullValue = header_list.some(
            (header) =>
              item[header] !== null &&
              item[header] !== undefined &&
              item[header] !== ""
          );
          const rowIndex =
            itemsToInsert.findIndex(
              (insertedItem) => insertedItem.ID === item.ID
            ) + 4; // Adding 4 because itemsToInsert starts from the 4th row of the Excel file
          if (hasNonNullValue) {
            duplicateRows.push({ ...item, rowIndex });
          } else {
            noDuplicateRows.push({ ...item, rowIndex });
          }
        });

        // Sort duplicateRows and noDuplicateRows by rowIndex in ascending order
        duplicateRows.sort((a, b) => a.rowIndex - b.rowIndex);
        noDuplicateRows.sort((a, b) => a.rowIndex - b.rowIndex);

        if (duplicateRows.length > 0 && resumeFlag === false) {
          console.log("중복발생3");
          setErrorText(
            `이미 등록된 중복값 <span class="text-red-600 font-bold">${duplicateRows.length}</span>건이 있습니다.<br>해당 데이터를 덮어씌우거나 제외 후 등록 하시겠습니까?`
          );
          setErrorRowList(duplicateRows);
          onOpen8();
          return;
        }

        if (uploadMode === "TYPE1") {
          console.log("TYPE1실행");
          console.log("itemsToInsert", itemsToInsert);
          for (const item of itemsToInsert) {
            const { ID, Type } = item;
            const { data, error } = await supabase
              .from("registerItems")
              .update(item)
              .eq("ID", ID)
              .eq("Type", Type);

            if (error) {
              console.error(
                `Error updating item with ID ${ID} and Type ${Type}:`,
                error
              );
            } else {
              console.log(
                `Item with ID ${ID} and Type ${Type} updated successfully:`,
                data
              );
            }
          }
          // onOpenChange6(false);
          // setResumeFlag(false);
          setExcelFile(null);
          onOpenChange7();
          getItems();
          setErrorText("등록이 완료되었습니다.");
          onOpen3();
          setErrorRowList([]);

          if (uploadMode === "TYPE2") {
            console.log("TYPE2실행");
            const { data, error } = await supabase
              .from("registerItems")
              .update(noDuplicateRows);
            if (error) {
              console.error("Error inserting data:", error);
            } else {
              console.log("Data inserted successfully:", data);
              setExcelFile(null);
              onOpenChange7();
              getItems();
              setErrorText("등록이 완료되었습니다.");
              onOpen3();
              setErrorRowList([]);
              setUploadComplete(true);
            }
          }
        }
      };
      reader.readAsArrayBuffer(excelFile);
    }
  };

  const handleChangeUnits = (selectedKeys) => {
    console.log(selectedKeys);
    const selectedUnit = selectedKeys.target.value;
    setUnits(selectedUnit);
  };

  const handleChangeFilterVariation = (selectedKeys) => {
    console.log(selectedKeys);
    const selectedFilterVariation = selectedKeys.target.value;
    setFilterVariation(selectedFilterVariation);
  };

  const handleChangeFilterType = (selectedKeys) => {
    console.log(selectedKeys);
    const selectedFilterType = selectedKeys.target.value;
    setFilterType(selectedFilterType);
  };

  const handleChangeSorting = (selectedKeys) => {
    console.log(selectedKeys);
    const selectedSorting = selectedKeys.target.value;
    setSorting(selectedSorting);
  };

  const handleChangeSearchFilter = (selectedKeys) => {
    console.log(selectedKeys);
    const selectedSearchFilter = selectedKeys.target.value;
    setFilterSearch(selectedSearchFilter);
  };

  const handleChangeSearchKeyword = (selectedKeys) => {
    console.log(selectedKeys);
    const selectedSearchKeyword = selectedKeys.target.value;
    setSearchKeyword(selectedSearchKeyword);
  };

  const validateNumber = (value) => !isNaN(value);

  useEffect(() => {
    const newIsInvalid = { ...isInvalid };

    if (
      checkedInfos["Visitor or Follower"] === "" ||
      !validateNumber(checkedInfos["Visitor or Follower"])
    ) {
      newIsInvalid["Visitor or Follower"] = true;
    } else {
      newIsInvalid["Visitor or Follower"] = false;
    }

    if (!checkedInfos["고객사명"]) {
      newIsInvalid["고객사명"] = true;
    } else {
      newIsInvalid["고객사명"] = false;
    }

    if (!checkedInfos["프로젝트명"]) {
      newIsInvalid["프로젝트명"] = true;
    } else {
      newIsInvalid["프로젝트명"] = false;
    }
    if (!checkedInfos["Week"]) {
      newIsInvalid["Week"] = true;
    } else {
      newIsInvalid["Week"] = false;
    }
    if (!checkedInfos["Product"]) {
      newIsInvalid["Product"] = true;
    } else {
      newIsInvalid["Product"] = false;
    }
    if (!checkedInfos["Keyword or Context"]) {
      newIsInvalid["Keyword or Context"] = true;
    } else {
      newIsInvalid["Keyword or Context"] = false;
    }
    if (!checkedInfos["Target"]) {
      newIsInvalid["Target"] = true;
    } else {
      newIsInvalid["Target"] = false;
    }
    if (!checkedInfos["Interest"]) {
      newIsInvalid["Interest"] = true;
    } else {
      newIsInvalid["Interest"] = false;
    }
    if (!checkedInfos["Keyword Challenge"]) {
      newIsInvalid["Keyword Challenge"] = true;
    } else {
      newIsInvalid["Keyword Challenge"] = false;
    }
    if (!checkedInfos["Type"]) {
      newIsInvalid["Type"] = true;
    } else {
      newIsInvalid["Type"] = false;
    }
    if (!checkedInfos["ID"] || /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(checkedInfos["ID"])) {
      newIsInvalid["ID"] = true;
    } else {
      newIsInvalid["ID"] = false;
    }
    if (!checkedInfos["URL"]) {
      newIsInvalid["URL"] = true;
    } else {
      newIsInvalid["URL"] = false;
    }
    if (!checkedInfos["Name"]) {
      newIsInvalid["Name"] = true;
    } else {
      newIsInvalid["Name"] = false;
    }
    if (
      !checkedInfos["Visitor or Follower"] ||
      !validateNumber(checkedInfos["Visitor or Follower"])
    ) {
      newIsInvalid["Visitor or Follower"] = true;
    } else {
      newIsInvalid["Visitor or Follower"] = false;
    }
    setIsInvalid(newIsInvalid);
  }, [checkedInfos]);

  console.log("checkedInfos:", checkedInfos);
  console.log("isInvalid:", isInvalid);
  return (
    <>
      {user && filterLoading1 ? (
        <>
          <div className="md:px-[20vw] px-[5vw] py-[5vh] ">
            <div className="mb-5">
              <div>
                <h2 className="font-bold mb-3">인플루언서 리스트</h2>
              </div>
              <div className="grid grid-cols-3 gap-x-2 w-full md:w-1/2">
                {filterLoading1 ? (
                  <>
                    <Select
                      items={companyNames}
                      placeholder="회사 선택"
                      className="col-span-1"
                      defaultSelectedKeys={
                        selectedCompanyName && selectedCompanyName !== "전체"
                          ? [selectedCompanyName]
                          : ["전체"]
                      }
                      selectedKeys={
                        !isMaster && selectedCompanyName
                          ? [selectedCompanyName]
                          : undefined
                      }
                      isDisabled={!isMaster}
                    >
                      {(company) => (
                        <SelectItem
                          key={company.key}
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
                <Button
                  color="primary"
                  className=""
                  onPress={() => {
                    setIsPossible(true);
                    getItems();
                  }}
                >
                  검색
                </Button>
              </div>
            </div>
            <Divider className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-7 mb-5 gap-x-10 justify-center items-center gap-y-2">
              <div className="col-span-1">
                <Select
                  label="단위"
                  items={showUnits}
                  placeholder="단위를 선택하세요"
                  className="w-full"
                  defaultSelectedKeys={["15"]}
                  onChange={handleChangeUnits}
                >
                  {(unit) => (
                    <SelectItem key={unit.key}>{unit.label}</SelectItem>
                  )}
                </Select>
              </div>
              <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-2">
                <Select
                  label="분류"
                  items={variations}
                  placeholder="분류를 선택하세요"
                  className="col-span-1"
                  defaultSelectedKeys={["전체"]}
                  onChange={handleChangeFilterVariation}
                >
                  {(variation) => (
                    <SelectItem key={variation.key}>
                      {variation.label}
                    </SelectItem>
                  )}
                </Select>
                <Select
                  label="타입"
                  items={userTypes}
                  placeholder="타입을 선택하세요"
                  className="col-span-1"
                  defaultSelectedKeys={["전체"]}
                  onChange={handleChangeFilterType}
                >
                  {(userType) => (
                    <SelectItem key={userType.key}>{userType.label}</SelectItem>
                  )}
                </Select>
                <Select
                  label="정렬"
                  items={sortings}
                  placeholder="정렬방법을 선택하세요"
                  className="col-span-1"
                  defaultSelectedKeys={["등록순"]}
                  onChange={handleChangeSorting}
                >
                  {(sorting) => (
                    <SelectItem key={sorting.key}>{sorting.label}</SelectItem>
                  )}
                </Select>
              </div>
              <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-x-2 gap-y-2">
                <Select
                  label={<span className="truncate">검색필터</span>}
                  items={searchFilters}
                  placeholder="검색 필터를 선택하세요"
                  className="col-span-1 h-auto"
                  defaultSelectedKeys={["제품명"]}
                  onChange={handleChangeSearchFilter}
                >
                  {(searchFilter) => (
                    <SelectItem key={searchFilter.key}>
                      {searchFilter.label}
                    </SelectItem>
                  )}
                </Select>
                <Input
                  label="검색어"
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="col-span-1 md:col-span-2 h-auto"
                  onChange={handleChangeSearchKeyword}
                />
                <Button
                  color="primary"
                  className="col-span-1 h-[56px]"
                  onClick={getItems}
                >
                  검색
                </Button>
              </div>
            </div>
            <div>
              <Table
                aria-label="Controlled table example with dynamic content"
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                isStriped
                onSelectionChange={setSelectedKeys}
                className="w-full"
                classNames={{
                  base: " overflow-scroll",
                  table: "",
                }}
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      width={20}
                      className="w-20 text-center truncate"
                      key={column.key}
                    >
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={items}>
                  {(item) => (
                    <TableRow key={item.id}>
                      {(columnKey) => (
                        <TableCell className="w-20 text-center text-nowrap">
                          {getKeyValue(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {totalPages >= 1 && (
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
              )}
            </div>
            <div className="flex flex-col md:flex-row md:justify-between gap-y-2">
              <div className="flex gap-x-2 justify-center items-center">
                {user.id === "cb1d1d38-ca7b-429a-8db5-770cd9085644" ? (
                  <>
                    <Button
                      variant="bordered"
                      radius="md"
                      onPress={() => {
                        setModalType("add");
                        setPrevModalType("add");
                        onOpen1();
                        setCheckedInfos({
                          분류: "미지정",
                        });
                        getFiles();
                        setPrevData(checkedInfos);
                      }}
                    >
                      개별 등록
                    </Button>
                    <Button variant="bordered" radius="md" onPress={onOpen5}>
                      엑셀 대량 등록
                    </Button>
                    <Button variant="bordered" radius="md" onPress={onOpen7}>
                      추가 정보 대량 등록
                    </Button>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className="flex justify-center items-center gap-x-2">
                <Button
                  variant="bordered"
                  radius="md"
                  onPress={() => {
                    if (
                      !selectedCompanyName ||
                      selectedCompanyName === "전체"
                    ) {
                      setErrorText("프로젝트를 선택 후 실행해주세요");
                      onOpen3();
                    } else {
                      onOpen4();
                    }
                  }}
                >
                  엑셀 추출
                </Button>
                <Button
                  color="primary"
                  radius="md"
                  onPress={() => {
                    if (selectedKeys.size === 0) {
                      setModalType("error");
                      setPrevModalType("error");
                      onOpen3();
                      setErrorText("항목을 선택 후 수정 버튼을 클릭해주세요");
                    } else {
                      setModalType("view");
                      setPrevModalType("view");
                      onOpen1();
                      getInfos();
                      getFiles();
                      setPrevData(checkedInfos);
                    }
                  }}
                >
                  자세히 보기
                </Button>
              </div>
            </div>
          </div>
          {modalType !== "complete" && (
            <Modal
              isOpen={isOpen1}
              onOpenChange={onOpenChange1}
              size="3xl"
              scrollBehavior="inside"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      {modalType === "view" && "자세히 보기"}
                      {modalType === "edit" && "프로젝트 수정"}
                      {modalType === "error" && "오류"}
                    </ModalHeader>
                    <ModalBody>
                      {true && (
                        <div className="flex flex-col gap-2">
                          <div>
                            <h3 className="font-bold">분류</h3>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <Select
                              label="분류"
                              className="col-span-1 max-w-xs"
                              defaultSelectedKeys={[checkedInfos.분류]}
                            >
                              {variations.map((variation) => (
                                <SelectItem
                                  onClick={() => {
                                    setCheckedInfos({
                                      ...checkedInfos,
                                      분류: variation.label,
                                    });
                                  }}
                                  key={variation.key}
                                >
                                  {variation.label}
                                </SelectItem>
                              ))}
                            </Select>
                            <Input
                              className="col-span-1"
                              type="text"
                              label="고객사명"
                              isInvalid={isInvalid["고객사명"]}
                              color={isInvalid["고객사명"] ? "danger" : ""}
                              placeholder="고객사명"
                              value={checkedInfos?.고객사명}
                              isDisabled={!isMaster}
                              onChange={(e) =>
                                setCheckedInfos({
                                  ...checkedInfos,
                                  고객사명: e.target.value,
                                })
                              }
                            />
                            <Input
                              className="col-span-1"
                              type="text"
                              label="프로젝트명"
                              isInvalid={isInvalid["프로젝트명"]}
                              color={isInvalid["프로젝트명"] ? "danger" : ""}
                              placeholder="프로젝트명"
                              isDisabled={!isMaster}
                              value={checkedInfos?.프로젝트명}
                              onChange={(e) =>
                                setCheckedInfos({
                                  ...checkedInfos,
                                  프로젝트명: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div>
                            <h3 className="font-bold">
                              프로젝트 정보
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              className="col-span-1"
                              type="text"
                              label="Week"
                              isInvalid={isInvalid["Week"]}
                              color={isInvalid["Week"] ? "danger" : ""}
                              placeholder="Week"
                              isDisabled={!isMaster}
                              value={checkedInfos?.Week}
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
                              isInvalid={isInvalid["Product"]}
                              color={isInvalid["Product"] ? "danger" : ""}
                              placeholder="Product"
                              value={checkedInfos?.Product}
                              isDisabled={!isMaster}
                              onChange={(e) =>
                                setCheckedInfos({
                                  ...checkedInfos,
                                  Product: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <h3 className="font-bold">
                              마케팅 정보<span style={{ color: "red" }}>*</span>
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              className="col-span-1"
                              type="text"
                              label="Target"
                              isInvalid={isInvalid["Target"]}
                              color={isInvalid["Target"] ? "danger" : ""}
                              placeholder="Target"
                              isDisabled={!isMaster}
                              value={checkedInfos?.Target}
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
                              isInvalid={isInvalid["Keyword or Context"]}
                              color={
                                isInvalid["Keyword or Context"] ? "danger" : ""
                              }
                              placeholder="Keyword or Context"
                              isDisabled={!isMaster}
                              value={checkedInfos?.["Keyword or Context"]}
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
                              isInvalid={isInvalid["Interest"]}
                              color={isInvalid["Interest"] ? "danger" : ""}
                              placeholder="Interest"
                              value={checkedInfos?.Interest}
                              isDisabled={!isMaster}
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
                              isInvalid={isInvalid["Keyword Challenge"]}
                              color={
                                isInvalid["Keyword Challenge"] ? "danger" : ""
                              }
                              placeholder="Keyword Challenge"
                              value={checkedInfos?.["Keyword Challenge"]}
                              isDisabled={!isMaster}
                              onChange={(e) =>
                                setCheckedInfos({
                                  ...checkedInfos,
                                  "Keyword Challenge": e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <h3 className="font-bold">
                              인플루언서 정보
                              <span style={{ color: "red" }}>*</span>
                            </h3>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <Select
                              items={typeList}
                              label="Type"
                              isInvalid={isInvalid["Type"]}
                              color={isInvalid["Type"] ? "danger" : ""}
                              className="col-span-1 max-w-xs"
                              defaultSelectedKeys={[checkedInfos.Type]}
                              isDisabled={!isMaster}
                              onChange={(selectedKeys) => {
                                const selectedType = selectedKeys.target.value;
                                setCheckedInfos((prevInfos) => ({
                                  ...prevInfos,
                                  Type: selectedType,
                                }));
                              }}
                            >
                              {(typeElem) => (
                                <SelectItem key={typeElem.key}>
                                  {typeElem.label}
                                </SelectItem>
                              )}
                            </Select>
                            <Tooltip content="한글을 제외하고 입력해주세요">
                              <Input
                                className="col-span-1"
                                type="text"
                                label="ID(영문입력)"
                                isInvalid={isInvalid["ID"]}
                                color={isInvalid["ID"] ? "danger" : ""}
                                placeholder="ID"
                                value={checkedInfos?.ID}
                                isDisabled={!isMaster}
                                onChange={(e) =>
                                  setCheckedInfos({
                                    ...checkedInfos,
                                    ID: e.target.value,
                                  })
                                }
                              />
                            </Tooltip>
                            <Input
                              className="col-span-1"
                              type="text"
                              label="Name"
                              isInvalid={isInvalid["Name"]}
                              color={isInvalid["Name"] ? "danger" : ""}
                              placeholder="Name"
                              value={checkedInfos?.Name}
                              isDisabled={!isMaster}
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
                              isInvalid={isInvalid["URL"]}
                              color={isInvalid["URL"] ? "danger" : ""}
                              placeholder="URL"
                              value={checkedInfos?.URL}
                              isDisabled={!isMaster}
                              onChange={(e) =>
                                setCheckedInfos({
                                  ...checkedInfos,
                                  URL: e.target.value,
                                })
                              }
                            />
                            {/* <Input
                              className="col-span-1"
                              type="text"
                              label="Visitor or Follower"
                              placeholder="Visitor or Follower"
                              value={checkedInfos?.["Visitor or Follower"]}
                              isDisabled={!isMaster}
                              
                              onChange={(e) =>

                                setCheckedInfos({
                                  ...checkedInfos,
                                  "Visitor or Follower": e.target.value,
                                })
                              }
                            /> */}
                            <Tooltip content="숫자만 입력해주세요">
                              <Input
                                className="col-span-1"
                                type="text"
                                isInvalid={isInvalid["Visitor or Follower"]}
                                color={
                                  isInvalid["Visitor or Follower"]
                                    ? "danger"
                                    : ""
                                }
                                label="Visitor or Follower"
                                placeholder="Visitor or Follower"
                                value={checkedInfos?.["Visitor or Follower"]}
                                isDisabled={!isMaster}
                                onChange={(e) =>
                                  setCheckedInfos({
                                    ...checkedInfos,
                                    "Visitor or Follower": e.target.value,
                                  })
                                }
                              />
                            </Tooltip>
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
                              value={checkedInfos?.["Creation cost"]}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.["2nd Usage"]}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.Mirroring}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.Title}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.["Contents URL"]}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.Views}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.like}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.Comment}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.비고}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.["URL with Parameter"]}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.["URL Shorten"]}
                              isDisabled={!isMaster}
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
                              value={checkedInfos?.["logger code"]}
                              isDisabled={!isMaster}
                              onChange={(e) =>
                                setCheckedInfos({
                                  ...checkedInfos,
                                  "logger code": e.target.value,
                                })
                              }
                            />
                          </div>
                          {isMaster && (
                            <>
                              <div>
                                <h3 className="font-bold">기타 상세 정보</h3>
                                <div className="flex gap-2 my-2">
                                  <Input
                                    type="text"
                                    label="이메일"
                                    placeholder="이메일"
                                    value={checkedInfos?.이메일}
                                    isDisabled={!isMaster}
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
                                    value={checkedInfos?.이름}
                                    isDisabled={!isMaster}
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
                                    value={checkedInfos?.연락처}
                                    isDisabled={!isMaster}
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
                                      value={checkedInfos?.우편번호}
                                      isDisabled={!isMaster}
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
                                      value={checkedInfos?.주소}
                                      isDisabled={!isMaster}
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
                                    value={checkedInfos?.배송메모}
                                    isDisabled={!isMaster}
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
                                    value={checkedInfos?.택배사}
                                    isDisabled={!isMaster}
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
                                    value={checkedInfos?.송장번호}
                                    isDisabled={!isMaster}
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
                                    value={checkedInfos?.사업자등록번호}
                                    isDisabled={!isMaster}
                                    onChange={(e) =>
                                      setCheckedInfos({
                                        ...checkedInfos,
                                        사업자등록번호: e.target.value,
                                      })
                                    }
                                  />
                                </div>
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
                                    isDisabled={!isMaster}
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
                                    isDisabled={!isMaster}
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
                                    isDisabled={!isMaster}
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
                                    isDisabled={!isMaster}
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
                                    isDisabled={!checkedInfos.ID || !isMaster}
                                    onPress={async () => {
                                      const fileInput =
                                        document.createElement("input");
                                      fileInput.type = "file";
                                      fileInput.onchange = async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          console.log(
                                            "Selected file:",
                                            file.name
                                          );
                                          const { data, error } =
                                            await supabase.storage
                                              .from("assets") // Replace with your bucket name
                                              .upload(
                                                `uploads/${checkedInfos.ID}/${file.name}`,
                                                file,
                                                { upsert: true }
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
                                              e.target.closest(
                                                "button"
                                              ).style.display = "none";
                                              const lastSelectedKey = Number(
                                                Array.from(selectedKeys).pop()
                                              );
                                              const selectedItem = items.find(
                                                (item) =>
                                                  item.id === lastSelectedKey
                                              );
                                              const fileName = e.target
                                                .closest("button")
                                                .textContent.trim();
                                              const { error } =
                                                await supabase.storage
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
                            </>
                          )}
                        </div>
                      )}
                      {modalType === "edit" && (
                        <>
                          <Input
                            type="text"
                            label="고객사명"
                            placeholder="고객사명"
                            value={changeCompanyName}
                            onChange={(e) =>
                              setChangeCompanyName(e.target.value)
                            }
                          />
                          <Input
                            type="text"
                            label="프로젝트명"
                            placeholder="프로젝트명"
                            value={changeProjectName}
                            onChange={(e) =>
                              setChangeProjectName(e.target.value)
                            }
                          />
                        </>
                      )}
                      {modalType === "error" && (
                        <>
                          <p>확인하실 항목을 선택해주세요</p>
                        </>
                      )}
                    </ModalBody>
                    <ModalFooter className="flex flex-col">
                      {modalType == "view" && (
                        <>
                          <Button
                            color="success"
                            onPress={() => {
                              changeInfos();
                            }}
                          >
                            수정
                          </Button>
                          {isMaster && (
                            <Button
                              color="danger"
                              onPress={() => {
                                deleteInfos();
                              }}
                            >
                              삭제
                            </Button>
                          )}
                        </>
                      )}
                      {modalType == "add" && (
                        <Button
                          // color="primary"
                          className="bg-[#b12928] text-white"
                          onPress={() => {
                            console.log(checkedInfos);
                            if (
                              checkedInfos.Week &&
                              checkedInfos.Product &&
                              checkedInfos.Target &&
                              checkedInfos["Keyword or Context"] &&
                              checkedInfos.Interest &&
                              checkedInfos["Keyword Challenge"] &&
                              checkedInfos.Type &&
                              checkedInfos.ID &&
                              checkedInfos.Name &&
                              checkedInfos.URL &&
                              checkedInfos["Visitor or Follower"]
                            ) {
                              addInfos();
                            } else {
                              setErrorText2("필수 항목을 재확인 해주세요");
                              onOpen2();
                            }
                          }}
                        >
                          등록
                        </Button>
                      )}
                      <Button
                        className="w-full"
                        color=""
                        variant="light"
                        onPress={onClose}
                      >
                        닫기
                      </Button>
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
                {(onClose) => (
                  <>
                    <ModalBody className="flex p-5">
                      {prevModalType === "add" && <p>저장 되었습니다.</p>}
                      {prevModalType === "view" && (
                        <p>수정이 완료되었습니다.</p>
                      )}
                      {prevModalType === "delete" && (
                        <p>삭제가 완료되었습니다.</p>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        className="bg-[#b12928] text-white"
                        onPress={onClose}
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
                  <ModalBody className="flex p-5">{errorText2}</ModalBody>
                  <ModalFooter>
                    <Button
                      className="bg-[#b12928] text-white"
                      onPress={onClose2}
                    >
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
                  <ModalBody className="flex p-5">
                    <div dangerouslySetInnerHTML={{ __html: errorText }}></div>
                    <ul>
                      {errorRowList.map((row) => (
                        <li key={row.rowIndex}>- {row.rowIndex}행</li>
                      ))}
                    </ul>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="bg-[#b12928] text-white"
                      onPress={onClose3}
                    >
                      확인
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isOpen4}
            onOpenChange={onOpenChange4}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose4) => (
                <>
                  <ModalHeader>
                    <h3 className="font-bold">엑셀 추출</h3>
                  </ModalHeader>
                  <ModalBody className="flex p-5">
                    <RadioGroup
                      orientation="horizontal"
                      className="flex justify-center text-primary"
                      defaultValue={downloadType}
                      onValueChange={setDownloadType}
                    >
                      <Radio value="전체">전체</Radio>
                      <Radio value="현재페이지">현재페이지</Radio>
                      <Radio value="선택 항목">선택 항목</Radio>
                    </RadioGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="bg-[#b12928] text-white"
                      onPress={() => {
                        handleDownload();
                        onClose4();
                      }}
                    >
                      받기
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isOpen5}
            onOpenChange={onOpenChange5}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose5) => (
                <>
                  <ModalHeader>
                    <h3 className="font-bold">엑셀 대량 등록</h3>
                  </ModalHeader>
                  <ModalBody className="flex p-5">
                    <div className="flex justify-center items-center gap-5">
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
                          const fileInput = document.createElement("input");
                          fileInput.type = "file";
                          fileInput.onchange = async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setExcelFile(file);
                            }
                          };
                          fileInput.click();
                        }}
                      >
                        Attach
                      </Button>
                      <div>
                        <span>
                          {excelFile ? excelFile.name : "No file selected"}
                        </span>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter className="flex w-full">
                    <div className="flex w-full justify-between">
                      <Button
                        className="text-white"
                        color="success"
                        onPress={() => {
                          const url =
                            "https://drkpukrcyodxhqvyajjo.supabase.co/storage/v1/object/public/assets/sample_file_rev03_240626.xlsx?t=2024-06-27T03%3A12%3A41.386Z";
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "sample_file.xlsx";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                      >
                        엑셀 서식 다운받기
                      </Button>
                      <Button
                        className="bg-[#b12928] text-white"
                        onPress={() => {
                          uploadFile(false);
                        }}
                      >
                        등록
                      </Button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isOpen6}
            onOpenChange={onOpenChange6}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose6) => (
                <>
                  <ModalBody className="flex p-5">
                    <div dangerouslySetInnerHTML={{ __html: errorText }}></div>
                    <ul>
                      {errorRowList.map((row) => (
                        <li key={row.rowIndex}>- {row.rowIndex}행</li>
                      ))}
                    </ul>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="bg-[#b12928] text-white"
                      onPress={() => {
                        onClose6();
                        uploadFile(true);
                      }}
                    >
                      제외하고 등록
                    </Button>
                    <Button onPress={onClose6}>취소</Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isOpen7}
            onOpenChange={onOpenChange7}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose7) => (
                <>
                  <ModalHeader>
                    <h3 className="font-bold">추가 정보 대량 등록</h3>
                  </ModalHeader>
                  <ModalBody className="flex p-5">
                    <div className="flex justify-center items-center gap-5">
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
                          const fileInput = document.createElement("input");
                          fileInput.type = "file";
                          fileInput.onchange = async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setExcelFile(file);
                            }
                          };
                          fileInput.click();
                        }}
                      >
                        Attach
                      </Button>
                      <div>
                        <span>
                          {excelFile ? excelFile.name : "No file selected"}
                        </span>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter className="flex w-full">
                    <div className="flex w-full justify-between">
                      <Button
                        className="text-white"
                        color="success"
                        onPress={() => {
                          const url =
                            "https://drkpukrcyodxhqvyajjo.supabase.co/storage/v1/object/public/assets/sample_file2_rev03_240626.xlsx?t=2024-06-27T03%3A12%3A48.192Z";
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "sample_file.xlsx";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}
                      >
                        엑셀 서식 다운받기
                      </Button>
                      <Button
                        className="bg-[#b12928] text-white"
                        onPress={() => {
                          uploadFileMore("TYPE1", false); // 업로드 시 모드를 선택하여 올리기
                        }}
                      >
                        등록
                      </Button>
                    </div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isOpen8}
            onOpenChange={onOpenChange8}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose8) => (
                <>
                  <ModalBody className="flex p-5">
                    <div dangerouslySetInnerHTML={{ __html: errorText }}></div>
                    <ul>
                      {errorRowList.map((row) => (
                        <li key={row.rowIndex}>- {row.rowIndex}행</li>
                      ))}
                    </ul>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="bg-[rgb(179,110,107)] text-white"
                      onPress={() => {
                        uploadFileMore("TYPE1", "false"); // 업로드 시 모드를 선택하여 올리기
                        onClose8();
                      }}
                    >
                      덮어씌우기
                    </Button>
                    <Button
                      className="bg-[#b12928] text-white"
                      onPress={() => {
                        uploadFileMore("TYPE2", "true");
                        // setResumeFlag(true);
                        onClose8();
                      }}
                    >
                      제외하고 등록
                    </Button>
                    <Button onPress={onClose8}>취소</Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <Modal
            isOpen={isOpen9}
            onOpenChange={onOpenChange9}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
          >
            <ModalContent>
              {(onClose9) => (
                <>
                  <ModalBody className="flex p-5">
                    <div>관리자만 접속 가능한 페이지입니다.</div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className="bg-[#b12928] text-white"
                      onPress={onClose9}
                    >
                      닫기
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      ) : (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
    </>
  );
}
