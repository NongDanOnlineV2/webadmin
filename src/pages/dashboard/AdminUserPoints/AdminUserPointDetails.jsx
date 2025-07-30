import React, { useEffect, useState } from "react";
import { Card, CardBody, Typography, Spinner } from "@material-tailwind/react";
import api from "@/utils/axiosInstance";
import { useSearchParams } from "react-router-dom";

export default function AdminUserPointDetails() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [history, setHistory] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPointHistory = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await api.get("/admin-user-points", {
        params: { userId }
      });

      setHistory(res.data?.history || []);
      setUserInfo(res.data?.user || {});
    } catch (error) {
      console.error("Lỗi tải dữ liệu lịch sử điểm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPointHistory();
  }, [userId]);

  const formatAction = (action) => {
    switch (action) {
      case "INCREASE":
        return { label: "Tăng điểm", color: "text-green-600" };
      case "DECREASE":
        return { label: "Giảm điểm", color: "text-red-600" };
      default:
        return { label: action, color: "text-gray-600" };
    }
  };

  return (
    <div className="p-4">
      <Typography variant="h5" className="mb-4">Lịch sử tích điểm</Typography>

      <Card className="p-4">
        {loading ? (
          <Spinner className="mx-auto" />
        ) : (
          <>
            <Typography className="font-bold mb-2">Họ tên: <span className="font-normal">{userInfo.fullName || ""}</span></Typography>
            <Typography className="font-bold mb-2">Email: <span className="font-normal">{userInfo.email || ""}</span></Typography>
            <Typography className="font-bold mb-4">Tổng điểm: <span className="font-normal">{userInfo.totalPoint || 0}</span></Typography>

            {history.length > 0 ? (
              <ul className="space-y-2">
                {history.map((item, idx) => {
                  const action = formatAction(item.action);
                  return (
                    <li key={idx} className={`rounded-md px-4 py-2 text-sm bg-gray-100 ${action.color}`}>
                      {item.point} điểm - {action.label} - {new Date(item.createdAt).toLocaleString()}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <Typography className="text-gray-500">Không có dữ liệu lịch sử</Typography>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
