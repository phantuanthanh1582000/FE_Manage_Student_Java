import React, { use, useEffect, useState } from "react";
import { Card, Modal, List, Button, Typography, Space, Tag, Checkbox, Row, Col, message, DatePicker } from "antd";
import { getAttendanceStudent, getLessonByDate, updateStatusAttendance } from '../../../services/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const LessonPage = () => {
    const [open, setOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [lessonData, setLessonData] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const showModal = async (lesson) => {
        setSelectedSchedule(lesson); 
        await fetchListStudent(lesson.lessonId); 
        setOpen(true);
    };

    const fetchListStudent = async (lessonId) => {
        try {
            const response = await getAttendanceStudent(lessonId);
            setStudentList(response.data || []);
        } catch (error) {
            console.error("Error fetching lesson data:", error);
        }
      };
    
    const fetchLessonDate = async (date = dayjs()) => {
        try {
            const formattedDate = dayjs(date).format("YYYY-MM-DD");
            console.log("Formatted date:", formattedDate.toString());
            const response = await getLessonByDate(formattedDate.toString());
            setLessonData(response.data);
        } catch (error) {
            console.error("Error fetching lesson data:", error);
        }
    }

  
    useEffect(() => {
        fetchLessonDate(selectedDate);
    }, []);

    const handleAttendance = (index, status) => {
        const updatedList = [...studentList];
        updatedList[index].status = status;
        setStudentList(updatedList);
      };

    const handleSubmitAttendance = async () => {
        const presentIds = studentList
            .filter((s) => s.status === "Present")
            .map((s) => s.id);
        console.log(presentIds);
        const payload = {
            ids: presentIds,
            status: "Present",
        };

        try {
            await saveAttendanceAPI(payload); 
            message.success("Lưu điểm danh thành công!");
            setOpen(false);
        } catch (error) {
            console.error("Error submitting attendance:", error);
            message.error("Lỗi khi lưu điểm danh.");
        }
      };
    const saveAttendanceAPI = async (payload) => {
        try {
            const response = await updateStatusAttendance(payload);
            if (response.status === 200) {
                return response.data.message || "Lưu điểm danh thành công!";
            }
        } catch (error) {
            console.error("Error saving attendance:", error);
            throw error;
        }
      };

    return (
        <div style={{ padding: "2rem", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Title level={2} style={{ textAlign: "center", color: "#1677ff" }}>
                📘 Lịch Dạy Hôm Nay
            </Title>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => {
                        setSelectedDate(date);
                        fetchLessonDate(date);
                    }}
                    format="YYYY-MM-DD"
                    allowClear={false}
                />
            </div>

            {lessonData.map((item, index) => (
                <Card
                    key={index}
                    title={<Text strong>{item.lessonName}</Text>}
                    bordered
                    style={{ marginBottom: "1rem" }}
                >
                    <p><strong>Thời gian:</strong> {item.startTime} - {item.endTime}</p>
                    <p><strong>Phòng:</strong> {item.roomName}</p>
                    <p><strong>Lớp:</strong> {item.className}</p>
                    <Button type="primary" onClick={() => showModal(item)}>
                        Xem chi tiết
                    </Button>
                </Card>
            ))}

            <Modal
                title={`Danh sách sinh viên - ${selectedSchedule?.className}`}
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <Row style={{ fontWeight: 600, marginBottom: 12, padding: "4px 12px" }}>
                    <Col span={16}>Tên sinh viên</Col>
                    <Col span={8}>Điểm danh</Col>
                </Row>

                <List
                    dataSource={studentList}
                    renderItem={(student, index) => {
                        const bgColor =
                            student.status === "present"
                                ? "#e6fffb"
                                : student.status === "absent"
                                    ? "#fff1f0"
                                    : "#ffffff";

                        return (
                            <List.Item
                                style={{
                                    backgroundColor: bgColor,
                                    padding: "8px 12px",
                                    borderBottom: "1px solid #f0f0f0",
                                }}
                            >
                                <Row style={{ width: "100%" }} align="middle">
                                    <Col span={16}>
                                        <Text>{student.studentName}</Text>
                                    </Col>
                                    <Col span={8}>
                                        <Checkbox
                                            checked={student.status === "Present"}
                                            onChange={(e) =>
                                                handleAttendance(index, e.target.checked ? "Present" : "Absent")
                                            }
                                        >
                                            {student.status === "Present" ? "Có mặt" : "Vắng mặt"}
                                        </Checkbox>
                                    </Col>
                                </Row>
                               
                            </List.Item>
                        );
                    }}
                />
                <Button type="primary" onClick={handleSubmitAttendance} style={{ marginTop: 16 }}>
                    Lưu điểm danh
                </Button>
            </Modal>
        </div>
    );
};

export default LessonPage;
