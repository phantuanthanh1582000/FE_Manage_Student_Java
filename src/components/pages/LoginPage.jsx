import React, { useEffect } from 'react';
import { Form, Input, Button, notification, Card, Row, Col, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/api';
import { useAuth } from '../../global/AuthenticationContext';

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { onLogin } = useAuth();

  // Lấy thông báo lỗi từ state nếu có
  const errorMessage = location.state?.errorMessage;

  useEffect(() => {
    if (errorMessage) {
      notification.error({
        message: 'Lỗi',
        description: errorMessage,
        duration: 5,
      });
    }
  }, [errorMessage]);

  const onFinish = async (values) => {
    try {
      const res = await login(values);
      if (res.code === 1) {
        onLogin(res.data);
        notification.success({ message: 'Đăng nhập thành công' });
        navigate('/');
      } else {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: res.message || 'Thông tin đăng nhập không chính xác',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Đăng nhập thất bại',
        description: error.message || 'Lỗi không xác định',
      });
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: 'url("../../../src/assets/background_login.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Row justify="center" align="middle" style={{ height: '100%' }}>
        <Col xs={22} sm={16} md={12} lg={8}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title
              level={2}
              style={{
                color: 'white',
                textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
                fontWeight: 'bold',
              }}
            >
              Hệ thống Quản lý Sinh viên
            </Title>
          </div>
          <Card
            title={<span style={{ fontWeight: 'bold', fontSize: '18px' }}>Đăng nhập</span>}
            bordered={false}
            style={{
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
            }}
          >
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email' }]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
