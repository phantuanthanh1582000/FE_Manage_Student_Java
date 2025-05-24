import { useState, useEffect } from "react";
import {
  getAllSchedule,
  getSubjectById,
  getClassById,
  getUserById,
  getRoomById,
  getAllSubjects,
  getAllClasses,
  getAllTeacher,
  getAllRoom,
  addSchedule,
  getLessons,
  addLessons,
  addAttendance
} from "../../../../services/api";
import { notification } from "antd";

export function useSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [subjectNames, setSubjectNames] = useState({});
  const [classNames, setClassNames] = useState({});
  const [teacherNames, setTeacherNames] = useState({});
  const [roomNames, setRoomNames] = useState({});
  const [lessons, setLessons] = useState([]);

  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Lấy danh sách lịch và dữ liệu tên liên quan (subject, class, teacher, room)
  const fetchData = async () => {
    try {
      const res = await getAllSchedule();
      if (res.data) {
        setSchedules(res.data);

        // Tạo danh sách id duy nhất
        const uniqueSubjectIds = [...new Set(res.data.map((item) => item.subjectId))];
        const uniqueClassIds = [...new Set(res.data.map((item) => item.classId))];
        const uniqueTeacherIds = [...new Set(res.data.map((item) => item.teacherId))];
        const uniqueRoomIds = [...new Set(res.data.map((item) => item.roomId))];

        // Lấy tên môn học
        const subjectResults = await Promise.all(
          uniqueSubjectIds.map(async (id) => {
            try {
              const res = await getSubjectById(id);
              return { id, name: res.data?.name || "Không xác định" };
            } catch {
              return { id, name: "Không xác định" };
            }
          })
        );
        setSubjectNames(Object.fromEntries(subjectResults.map((i) => [i.id, i.name])));

        // Lấy tên lớp
        const classResults = await Promise.all(
          uniqueClassIds.map(async (id) => {
            try {
              const res = await getClassById(id);
              return { id, name: res.data?.className || "Không xác định" };
            } catch {
              return { id, name: "Không xác định" };
            }
          })
        );
        setClassNames(Object.fromEntries(classResults.map((i) => [i.id, i.name])));

        // Lấy tên giáo viên
        const teacherResults = await Promise.all(
          uniqueTeacherIds.map(async (id) => {
            try {
              const res = await getUserById(id);
              return { id, name: res.data?.fullName || "Không xác định" };
            } catch {
              return { id, name: "Không xác định" };
            }
          })
        );
        setTeacherNames(Object.fromEntries(teacherResults.map((i) => [i.id, i.name])));

        // Lấy tên phòng
        const roomResults = await Promise.all(
          uniqueRoomIds.map(async (id) => {
            try {
              const res = await getRoomById(id);
              return { id, name: res.data?.name || "Không xác định" };
            } catch {
              return { id, name: "Không xác định" };
            }
          })
        );
        setRoomNames(Object.fromEntries(roomResults.map((i) => [i.id, i.name])));
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
    }
  };

  // Lấy dữ liệu cho form Select
  const fetchFormOptions = async () => {
    try {
      const [subjects, classes, teachers, rooms] = await Promise.all([
        getAllSubjects(),
        getAllClasses(),
        getAllTeacher(),
        getAllRoom(),
      ]);
      setSubjects(subjects.data || []);
      setClasses(classes.data || []);
      setTeachers(teachers.data || []);
      setRooms(rooms.data || []);
    } catch (error) {
      console.error("Error loading form options:", error);
    }
  };

  // Thêm lịch học mới
  const handleAddSchedule = async (values) => {
  try {
    const payload = {
      ...values,
      startDate: values.dateRange[0].format("YYYY-MM-DD"),
      endDate: values.dateRange[1].format("YYYY-MM-DD"),
      startTime: values.timeRange[0].format("HH:mm"),
      endTime: values.timeRange[1].format("HH:mm"),
    };
    delete payload.dateRange;
    delete payload.timeRange;

    // 1. Tạo schedule
    const res = await addSchedule(payload);
    if (res.code === 1) {
      const scheduleId = res.data.id;

      // 2. Tạo lesson theo scheduleId
      const lessonRes = await addLessons({ scheduleId });
      if (lessonRes.code !== 1) {
        throw new Error(lessonRes.message || "Lỗi khi tạo lesson");
      }

      // 3. Tạo attendance theo scheduleId
      const attendanceRes = await addAttendance(scheduleId);
      if (attendanceRes.code !== 1) { // axios trả về status HTTP
        throw new Error("Lỗi khi tạo điểm danh");
      }

      notification.success({
        message: "Thành công",
        description: "Tạo lịch học, tiết học và điểm danh thành công.",
      });
      fetchData();
      return true;
    } else {
      throw new Error(res.message || "Lỗi khi tạo lịch học");
    }
  } catch (err) {
    notification.error({
      message: "Thất bại",
      description: err.message,
    });
    return false;
  }
};


  // Xem chi tiết các tiết học
  const handleViewSchedule = async (record) => {
    setSelectedRecordId(record.id);
    try {
      const res = await getLessons({
        params: { scheduleId: record.id },
      });
      setLessons(res.data || []);
      return true;
    } catch (error) {
      console.error("Error loading lessons:", error);
      setLessons([]);
      return false;
    }
  };

  useEffect(() => {
    fetchData();
    fetchFormOptions();
  }, []);

  return {
    schedules,
    subjectNames,
    classNames,
    teacherNames,
    roomNames,
    lessons,
    selectedRecordId,
    selectedRowKey,
    currentPage,
    pageSize,
    subjects,
    classes,
    teachers,
    rooms,
    setSelectedRowKey,
    setCurrentPage,
    setPageSize,
    setLessons,
    handleAddSchedule,
    handleViewSchedule,
  };
}
