import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Typography, Button, Flex } from "antd";
import { useQuery } from "@apollo/client";
import { GET_PERSON_WITH_CARS } from "../graphql/queries/queries";

const { Title, Text } = Typography;

const Details = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  const person = data.person;

  return (
    <Flex vertical gap="large" align="center" style={containerStyles}>
      <Flex style={buttonContainerStyles}>
        <Button type="primary">
          <Link to="/">Back</Link>
        </Button>
      </Flex>
      {person ? (
        <Flex vertical gap="small">
          <Title level={2}>
            {person?.firstName || ""} {person?.lastName || ""}
          </Title>

          <Title level={4}>Cars</Title>
          <Flex horizontal style={carsContainerStyles} gap="small">
            {person && person.cars.length === 0 ? (
              <Text>No cars found for this person.</Text>
            ) : (
              person &&
              person.cars.map((car) => (
                <Card
                  key={car.id}
                  style={{ marginBottom: "16px" }}
                  title={`${car.year} ${car.make} ${car.model}`}
                >
                  <Text>
                    Price:
                    {" " +
                      new Intl.NumberFormat("us-EN", {
                        style: "currency",
                        currency: "CAD",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(car.price)}
                  </Text>
                </Card>
              ))
            )}
          </Flex>
        </Flex>
      ) : (
        <Title level={2}>No information for person with id {id}</Title>
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
  width: "100%",
};
const carsContainerStyles = {
  width: "100%",
};
const buttonContainerStyles = {
  margin: "1rem 0.5rem",
  width: "100%",
};
export default Details;
