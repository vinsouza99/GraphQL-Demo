import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Flex, Typography, Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Title } = Typography;
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PEOPLE,
  ADD_PERSON,
  UPDATE_PERSON,
  DELETE_PERSON,
  GET_CARS,
  ADD_CAR,
  DELETE_CAR,
  UPDATE_CAR,
} from "../graphql/queries/queries.js";
import { Link } from "react-router-dom";

const PeopleAndCars = () => {
  // Correct destructuring for Apollo hooks
  const {
    loading: peopleLoading,
    error: peopleError,
    data: peopleData,
  } = useQuery(GET_PEOPLE);
  const { data: carsData } = useQuery(GET_CARS);

  const [people, setPeople] = useState([]);
  const [cars, setCars] = useState([]);
  const [personForm] = Form.useForm();
  const [carForm] = Form.useForm();
  const [editingCarId, setEditingCarId] = useState(null);
  const [editingPersonId, setEditingPersonId] = useState(null);

  const [addPerson] = useMutation(ADD_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const [updatePerson] = useMutation(UPDATE_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }, { query: GET_CARS }],
  });

  const [deletePerson] = useMutation(DELETE_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }, { query: GET_CARS }],
  });

  const [addCar] = useMutation(ADD_CAR, {
    refetchQueries: [{ query: GET_CARS }],
  });
  const [updateCar] = useMutation(UPDATE_CAR, {
    refetchQueries: [{ query: GET_PEOPLE }, { query: GET_CARS }],
  });

  const [deleteCar] = useMutation(DELETE_CAR, {
    refetchQueries: [{ query: GET_CARS }],
  });

  useEffect(() => {
    if (peopleData?.people) {
      setPeople([...peopleData.people]);
    }
  }, [peopleData]);

  useEffect(() => {
    if (carsData?.cars) {
      setCars([...carsData.cars]);
    }
  }, [carsData]);

  const handleAddPerson = (values) => {
    personForm.resetFields();
    const personData = {
      ...values,
    };
    if (editingPersonId) {
      personData.id = editingPersonId;
      updatePerson({
        variables: personData,
      });
      setEditingPersonId(null);
    } else {
      addPerson({ variables: values });
    }

    personForm.resetFields();
  };

  const handleAddCar = (values) => {
    // Transform form data to match GraphQL schema
    const carData = {
      ...values,
      year: parseInt(values.year, 10),
      price: parseFloat(values.price),
      personId: values.personId, // Changed from person to personId
    };
    if (editingCarId) {
      carData.id = editingCarId;
      updateCar({
        variables: carData,
      });
      setEditingCarId(null);
    } else {
      addCar({ variables: carData });
    }

    carForm.resetFields();
  };

  const handleEditPerson = (person) => {
    personForm.setFieldsValue({
      firstName: person.firstName,
      lastName: person.lastName,
    });
    setEditingPersonId(person.id);

    window.scrollTo({
      top: document.getElementById("personForm")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  const handleDeletePerson = (person) => {
    const id = person.id;
    deletePerson({ variables: { id } });
  };

  const handleDeleteCar = (car) => {
    const id = car.id;
    deleteCar({ variables: { id } });
  };
  const handleEditCar = (car) => {
    carForm.setFieldsValue({
      year: car.year.toString(),
      make: car.make,
      model: car.model,
      price: car.price.toString(),
      personId: car.personId,
    });

    setEditingCarId(car.id);

    window.scrollTo({
      top: document.getElementById("carForm")?.offsetTop || 0,
      behavior: "smooth",
    });
  };

  return (
    <Flex vertical gap="large" align="center" style={containerStyles}>
      {/* Add Person Form */}
      <Title level={4}>Add Person</Title>
      <Form form={personForm} layout="inline" onFinish={handleAddPerson}>
        <Flex gap={8} wrap>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: "First name required" }]}
          >
            <Input placeholder="First Name" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: "Last name required" }]}
          >
            <Input placeholder="Last Name" style={{ width: 150 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingPersonId ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Flex>
      </Form>

      {/* Add Car Form */}
      {people && people.length > 0 && (
        <>
          <Title level={4}>Add Car</Title>
          <Form form={carForm} layout="inline" onFinish={handleAddCar}>
            <Flex gap={8} wrap>
              <Form.Item
                name="year"
                rules={[{ required: true, message: "Year required" }]}
              >
                <Input
                  placeholder="Year"
                  style={{ width: 120 }}
                  type="number"
                />
              </Form.Item>
              <Form.Item
                name="make"
                rules={[{ required: true, message: "Make required" }]}
              >
                <Input placeholder="Make" style={{ width: 120 }} />
              </Form.Item>
              <Form.Item
                name="model"
                rules={[{ required: true, message: "Model required" }]}
              >
                <Input placeholder="Model" style={{ width: 120 }} />
              </Form.Item>
              <Form.Item
                name="price"
                rules={[{ required: true, message: "Price required" }]}
              >
                <Input
                  placeholder="Price"
                  style={{ width: 120 }}
                  type="number"
                  step="0.01"
                />
              </Form.Item>
              <Form.Item
                name="personId" // Changed from person to personId to match GraphQL schema
                rules={[{ required: true, message: "Select a person" }]}
              >
                <Select
                  placeholder="Select Person"
                  disabled={people.length === 0}
                  style={{ width: 160 }}
                >
                  {people.map((person) => (
                    <Select.Option key={person.id} value={person.id}>
                      {person.firstName + " " + person.lastName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={people.length === 0}
                >
                  {editingCarId ? "Update" : "Add"}
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </>
      )}

      {/* Cards for each person */}
      {peopleLoading ? (
        <Flex style={messageContainer}>
          <Title level={3}>Loading...</Title>
        </Flex>
      ) : peopleError ? (
        <Flex style={messageContainer}>
          <Title level={3}>
            There was an error loading the data: {peopleError.message}
          </Title>
        </Flex>
      ) : (
        people.map((person) => (
          <div key={person.id} style={{ width: "100%", overflowX: "auto" }}>
            <Card
              title={person.firstName + " " + person.lastName}
              style={{ maxWidth: "100%", textAlign: "left" }}
              actions={[
                <Link to={`/details/${person.id}`}>Learn More</Link>,
                <EditOutlined
                  key="edit"
                  onClick={() => handleEditPerson(person)}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDeletePerson(person)}
                />,
              ]}
            >
              {cars
                .filter((car) => car.personId === person.id)
                .map((car) => (
                  <Card
                    key={car.id}
                    type="inner"
                    style={{ marginBottom: 16 }}
                    actions={[
                      <EditOutlined
                        key="edit"
                        onClick={() => handleEditCar(car)}
                      />,
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleDeleteCar(car)}
                      />,
                    ]}
                    title={car.year + " " + car.make + " " + car.model}
                  >
                    {`Price: ${new Intl.NumberFormat("us-EN", {
                      style: "currency",
                      currency: "CAD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(car.price)}`}
                  </Card>
                ))}
            </Card>
          </div>
        ))
      )}
    </Flex>
  );
};
const containerStyles = {
  backgroundColor: "rgba(255,255,255,0.5)",
  borderRadius: "10px",
  padding: "0rem 2rem 2rem 2rem",
  margin: "1rem 0.5rem",
  maxWidth: "1200px",
  overflowX: "hidden",
};

const messageContainer = {
  width: "100%",
  padding: "3rem",
};

export default PeopleAndCars;
