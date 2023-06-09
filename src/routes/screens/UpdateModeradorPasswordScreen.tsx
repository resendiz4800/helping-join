import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { updateModeradorPassword } from "../../services/api/updateModeradorPassword";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import PasswordInput from "../../components/general/PasswordInput";

type Inputs = {
  password: string;
  confirmPassword: string;
};

const UpdatePasswordModeradorScreen = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>();
  const toast = useToast();

  const handleUpdatePassword = async (data: Inputs) => {
    try {
      const result = await updateModeradorPassword({
        id_moderador: parseInt(params.id || "0"),
        contrasena: data.password,
      });

      if (result.success) {
        toast({
          title: "Contraseña actualizada",
          description:
            "La contraseña se actualizó correctamente, inicie sesión con su nueva contraseña",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/signin", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Heading>Actualiza tu contraseña</Heading>

      <Box
        w="50%"
        borderRadius={8}
        borderWidth={1}
        borderColor="orange.300"
        backgroundColor="white"
        p={8}
        mt={8}
      >
        <VStack spacing={4}>
          <FormControl isRequired isInvalid={errors.password ? true : false}>
            <FormLabel>Nueva contraseña</FormLabel>
            <PasswordInput
              placeholder="Nueva contraseña"
              register={register("password", {
                required: "Este campo es requerido",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message:
                    "La contraseña debe tener al menos 1 mayúscula, 1 minúscula y 1 número",
                },
                // validar que la contrasena sea distinta de "Cambiame1"
                validate: {
                  isNotCambiame1: (value) =>
                    value !== "Cambiame1" ||
                    "La contraseña no puede ser Cambiame1",
                },
              })}
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.confirmPassword ? true : false}
          >
            <FormLabel>Confirmar contraseña</FormLabel>
            <PasswordInput
              placeholder="Confirmar contraseña"
              register={register("confirmPassword", {
                required: "Este campo es requerido",
                validate: {
                  matchesPreviousPassword: (value) => {
                    const { password } = getValues();
                    return password === value || "Las contraseñas no coinciden";
                  },
                },
              })}
            />
            {errors.confirmPassword && (
              <FormErrorMessage>
                {errors.confirmPassword.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <Flex justifyContent="flex-end" w="full">
            <Button
              colorScheme="orange"
              type="submit"
              onClick={handleSubmit(handleUpdatePassword)}
            >
              Actualizar
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default UpdatePasswordModeradorScreen;
