import React, { useEffect, useState } from "react";
import {
  Table,
  Radio,
  Space,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  TimePicker,
  message,
  Row,
  Col,
  notification 
} from "antd";
import { EyeOutlined, CheckCircleOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
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
  addSchedule
} from "../../services/api";

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [subjectNames, setSubjectNames] = useState({});
  const [classNames, setClassNames] = useState({});
  const [teacherNames, setTeacherNames] = useState({});
  const [roomNames, setRoomNames] = useState({});
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getAllSchedule();
      if (res.data) {
        setSchedules(res.data);

        const uniqueSubjectIds = [...new Set(res.data.map(item => item.subjectId))];
        const uniqueClassIds = [...new Set(res.data.map(item => item.classId))];
        const uniqueTeacherIds = [...new Set(res.data.map(item => item.teacherId))];
        const uniqueRoomIds = [...new Set(res.data.map(item => item.roomId))];

        const subjectResults = await Promise.all(uniqueSubjectIds.map(async (id) => {
          try {
            const res = await getSubjectById(id);
            return { id, name: res.data?.name || "Không xác định" };
          } catch {
            return { id, name: "Không xác định" };
          }
        }));
        setSubjectNames(Object.fromEntries(subjectResults.map(i => [i.id, i.name])));

        const classResults = await Promise.all(uniqueClassIds.map(async (id) => {
          try {
            const res = await getClassById(id);
            return { id, name: res.data?.className || "Không xác định" };
          } catch {
            return { id, name: "Không xác định" };
          }
        }));
        setClassNames(Object.fromEntries(classResults.map(i => [i.id, i.name])));

        const teacherResults = await Promise.all(uniqueTeacherIds.map(async (id) => {
          try {
            const res = await getUserById(id);
            return { id, name: res.data?.fullName || "Không xác định" };
          } catch {
            return { id, name: "Không xác định" };
          }
        }));
        setTeacherNames(Object.fromEntries(teacherResults.map(i => [i.id, i.name])));

        const roomResults = await Promise.all(uniqueRoomIds.map(async (id) => {
          try {
            const res = await getRoomById(id);
            return { id, name: res.data?.name || "Không xác định" };
          } catch {
            return { id, name: "Không xác định" };
          }
        }));
        setRoomNames(Object.fromEntries(roomResults.map(i => [i.id, i.name])));
      }
    } catch (error) {
      console.error("Error loading schedule:", error);
    }
  };

  const handleViewSchedule = (record) => {
    // Xử lý xem tiết học, ví dụ show modal hoặc điều hướng
    console.log("Xem tiết học:", record);
    message.info(`Xem tiết học của lịch ID: ${record.id}`);
};

const handleViewAttendance = (record) => {
  // Xử lý xem điểm danh
  console.log("Xem điểm danh:", record);
  message.info(`Xem điểm danh của lịch ID: ${record.id}`);
};

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

  useEffect(() => {
    fetchData();
    fetchFormOptions();
  }, []);

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

            console.log("📌 Payload tạo lịch:", payload);

            const res = await addSchedule(payload);
            if(res.code ===1){
                notification.success({
                    message: "Thành công",
                    description: "Tạo lịch học thành công.",
                });

                setIsModalVisible(false);
                form.resetFields();
                fetchData(); 
            }
        } catch (err) {
            notification.error({
            message: "Thất bại",
            description: err.message,
            });
        }
    };


  const columns = [
    {
      title: "Chọn",
      dataIndex: "radio",
      render: (_, record) => (
        <Radio
          checked={selectedRowKey === record.id}
          onChange={() => setSelectedRowKey(record.id)}
        />
      ),
    },
    {
      title: 'STT',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Môn học",
      dataIndex: "subjectId",
      render: (id) => subjectNames[id] || "Đang tải...",
    },
    {
      title: "Lớp",
      dataIndex: "classId",
      render: (id) => classNames[id] || "Đang tải...",
    },
    {
      title: "Giáo viên",
      dataIndex: "teacherId",
      render: (id) => teacherNames[id] || "Đang tải...",
    },
    {
      title: "Phòng",
      dataIndex: "roomId",
      render: (id) => roomNames[id] || "Đang tải...",
    },
    {
      title: "Ngày học",
      render: (_, r) => `${r.startDate} - ${r.endDate}`,
    },
    {
      title: "Thời gian",
      render: (_, r) => `${r.startTime} - ${r.endTime}`,
    },
    {
        title: "Thứ",
        dataIndex: "dayOfWeek",
        render: (day) => {
            const daysMap = {
            MONDAY: "Thứ 2",
            TUESDAY: "Thứ 3",
            WEDNESDAY: "Thứ 4",
            THURSDAY: "Thứ 5",
            FRIDAY: "Thứ 6",
            SATURDAY: "Thứ 7",
            };
            return daysMap[day] || day;
        },
    },
    {
        title: "Thao tác",
        key: "actions",
        render: (_, record) => (
        <Space size="middle">
            <EyeOutlined
            style={{ color: "#1890ff", cursor: "pointer" }}
            onClick={() => handleViewSchedule(record)}
            title="Xem tiết học"
            />
            <CheckCircleOutlined
            style={{ color: "#52c41a", cursor: "pointer" }}
            onClick={() => handleViewAttendance(record)}
            title="Xem điểm danh"
            />
        </Space>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý lịch học</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          + Thêm lịch học
        </Button>
      </Space>
      <Table
        dataSource={schedules}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: false,
        }}
      />
      <Modal
        title="Thêm lịch học"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleAddSchedule}>
          <Form.Item label="Môn học" name="subjectId" rules={[{ required: true }]}>
            <Select placeholder="Chọn môn học">
              {subjects.map((s) => (
                <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Lớp" name="classId" rules={[{ required: true }]}>
            <Select placeholder="Chọn lớp">
              {classes.map((c) => (
                <Select.Option key={c.id} value={c.id}>{c.className}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Giáo viên" name="teacherId" rules={[{ required: true }]}>
            <Select placeholder="Chọn giáo viên">
              {teachers.map((t) => (
                <Select.Option key={t.id} value={t.id}>{t.fullName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Phòng" name="roomId" rules={[{ required: true }]}>
            <Select placeholder="Chọn phòng">
              {rooms.map((r) => (
                <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item label="Ngày học" name="dateRange" rules={[{ required: true }]}>
                <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item label="Thời gian" name="timeRange" rules={[{ required: true }]}>
                <TimePicker.RangePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
            </Col>
            </Row>
          <Form.Item label="Thứ" name="dayOfWeek" rules={[{ required: true }]}>
            <Select placeholder="Chọn thứ">
              <Select.Option value="MONDAY">Thứ 2</Select.Option>
              <Select.Option value="TUESDAY">Thứ 3</Select.Option>
              <Select.Option value="WEDNESDAY">Thứ 4</Select.Option>
              <Select.Option value="THURSDAY">Thứ 5</Select.Option>
              <Select.Option value="FRIDAY">Thứ 6</Select.Option>
              <Select.Option value="SATURDAY">Thứ 7</Select.Option>
              <Select.Option value="SUNDAY">Chủ nhật</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SchedulePage;
