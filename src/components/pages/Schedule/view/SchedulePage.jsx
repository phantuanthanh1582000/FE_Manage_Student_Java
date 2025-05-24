import React, { useState } from "react";
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
  Row,
  Col,
  List,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useSchedule } from "../viewmodal/ScheduleModal"; 
import { getAttendance } from "../../../../services/api";

const SchedulePage = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);

  const fetchAttendanceByLessonId = async (lessonId) => {
  try {
    const res = await getAttendance(lessonId);
    setAttendanceList(res.data);
  } catch (err) {
    console.error("Lỗi khi lấy điểm danh:", err);
    setAttendanceList([]);            
  }
};

  const {
    schedules,
    subjectNames,
    classNames,
    teacherNames,
    roomNames,
    lessons,
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
  } = useSchedule();

  const onFinish = async (values) => {
    const success = await handleAddSchedule(values);
    if (success) {
      setIsModalVisible(false);
      form.resetFields();
    }
  };

  const onViewSchedule = async (record) => {
    const success = await handleViewSchedule(record);
    if (success) {
      setViewModalVisible(true);
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
      title: "STT",
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
      title: "Hành động",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => onViewSchedule(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div style={{padding: 24}}>
      <h2>Danh sách lịch học</h2>
      <Space style={{marginBottom: 16}}>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Thêm lịch học
        </Button>
      </Space>
      
      <Table
        rowKey="id"
        columns={columns}
        dataSource={schedules}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
      />

      {/* Modal thêm lịch học */}
      <Modal
        title="Thêm lịch học"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="Thêm"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true, message: "Vui lòng chọn môn học" }]}
          >
            <Select placeholder="Chọn môn học">
              {subjects.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="classId"
            label="Lớp"
            rules={[{ required: true, message: "Vui lòng chọn lớp" }]}
          >
            <Select placeholder="Chọn lớp">
              {classes.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.className}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="teacherId"
            label="Giáo viên"
            rules={[{ required: true, message: "Vui lòng chọn giáo viên" }]}
          >
            <Select placeholder="Chọn giáo viên">
              {teachers.map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.fullName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="roomId"
            label="Phòng"
            rules={[{ required: true, message: "Vui lòng chọn phòng" }]}
          >
            <Select placeholder="Chọn phòng">
              {rooms.map((r) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateRange"
                label="Ngày học"
                rules={[{ required: true, message: "Chọn ngày học" }]}
              >
                <DatePicker.RangePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="timeRange"
                label="Thời gian học"
                rules={[{ required: true, message: "Chọn thời gian học" }]}
              >
                <TimePicker.RangePicker format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dayOfWeek"
            label="Thứ trong tuần"
            rules={[{ required: true, message: "Chọn thứ trong tuần" }]}
          >
            <Select placeholder="Chọn thứ trong tuần">
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

      {/* Modal xem chi tiết tiết học */}
      <Modal
        title="Chi tiết các tiết học"
        open={viewModalVisible}
        footer={null}
        onCancel={() => {
          setViewModalVisible(false);
          setLessons([]);
        }}
      >
        <List
          dataSource={lessons}
          renderItem={(lesson) => (
            <List.Item
              key={lesson.id}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div>
                {lesson.name} - {lesson.date} ({lesson.startTime} - {lesson.endTime})
              </div>
              <Button
                type="link"
                onClick={async () => {
                  const res = await fetchAttendanceByLessonId(lesson.id);
                  setAttendanceModalVisible(true);
                }}
              >
                Xem thêm
              </Button>
            </List.Item>
          )}
          style={{ maxHeight: 300, overflowY: "auto" }}
          locale={{ emptyText: "Không có dữ liệu tiết học" }}
        />
      </Modal>

      <Modal
        title="Danh sách điểm danh"
        open={attendanceModalVisible}
        onCancel={() => setAttendanceModalVisible(false)}
        footer={null}
      >
        <List
          dataSource={attendanceList}
          renderItem={(student) => (
            <List.Item>
              {student.studentName} - {student.status === "Present" ? "Có mặt" : "Vắng"}
            </List.Item>
          )}
          locale={{ emptyText: "Không có dữ liệu điểm danh" }}
        />
      </Modal>
    </div>
  );
};

export default SchedulePage;
