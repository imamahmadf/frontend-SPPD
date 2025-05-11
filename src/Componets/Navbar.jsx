import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Container,
  FormControl,
  FormLabel,
  Center,
  HStack,
  Table,
  Spacer,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import Logout from "./Logout";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  userRedux,
  selectRole,
} from "../Redux/Reducers/auth";
import Logo from "../assets/logo.png";

function Navbar() {
  const isAuthenticated =
    useSelector(selectIsAuthenticated) || localStorage.getItem("token");
  const user = useSelector(userRedux);
  const role = useSelector(selectRole);
  // console.log("Is Authenticated:", isAuthenticated);
  console.log("User Data:", user);
  const history = useHistory();

  return (
    <Box color={"white"} bgColor={"primary"}>
      <Container py={"20px"} maxW={"1280px"}>
        <HStack gap={5}>
          <Image height="65px" overflow="hiden" objectFit="cover" src={Logo} />
          <Text>{user[0]?.nama}</Text>
          {/* <Text>{JSON.stringify(role)}</Text> */}
          <Spacer />{" "}
          <Box
            as="button"
            transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
            _hover={{
              bg: "secondary",
              color: "black",
            }}
            onClick={() => {
              history.push("/");
            }}
          >
            <Text>HOME</Text>
          </Box>
          <Menu>
            <MenuButton as={Button}>PERJALANAN</MenuButton>
            <MenuList color={"black"}>
              <Link to={"/perjalanan"}>
                <MenuItem>Perjalanan</MenuItem>
              </Link>
              <Link to={"/daftar"}>
                <MenuItem>Daftar Perjalanan</MenuItem>
              </Link>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button}>Keuangan</MenuButton>
            <MenuList color={"black"}>
              <Link to={"/admin/keuangan/daftar-perjalanan"}>
                <MenuItem>Daftar</MenuItem>
              </Link>
              {/* <Link to={"/daftar"}>
                <MenuItem>Daftar Perjalanan</MenuItem>
              </Link> */}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button}>Kepegawaian</MenuButton>
            <MenuList color={"black"}>
              <Link to={"/daftar-pegawai"}>
                <MenuItem>Daftar Pegawai</MenuItem>
              </Link>
              {/* <Link to={"/daftar"}>
                <MenuItem>Daftar Perjalanan</MenuItem>
              </Link> */}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button}>ADMIN</MenuButton>
            <MenuList color={"black"}>
              <Link to={"/admin/induk-unit-kerja"}>
                <MenuItem>Induk Unit Kerja</MenuItem>
              </Link>{" "}
              <Link to={"/admin/daftar-bendahara"}>
                <MenuItem>Daftar Bendahara</MenuItem>
              </Link>
              <Link to={"/admin/template"}>
                <MenuItem>Template</MenuItem>
              </Link>
              <Link to={"/admin/sub-kegiatan"}>
                <MenuItem>Sub Kegiatan</MenuItem>
              </Link>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button}>SURAT</MenuButton>
            <MenuList color={"black"}>
              <Link to={"/admin/nomor-surat"}>
                <MenuItem>Pengaturan</MenuItem>
              </Link>{" "}
              <Link to={"/admin/surat-keluar"}>
                <MenuItem>Daftar Surat Keluar</MenuItem>
              </Link>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button}>ADMIN PUSAT</MenuButton>
            <MenuList color={"black"}>
              <Link to={"/admin/dalam-kota"}>
                <MenuItem>Daftar Dalam Kota</MenuItem>
              </Link>
              <Link to={"/admin/tambah-user"}>
                <MenuItem>Pengaturan Pengguna</MenuItem>
              </Link>
              <Link to={"/admin/daftar-user"}>
                <MenuItem>Daftar Pengguna</MenuItem>
              </Link>

              <Link to={"/admin/daftar-induk-unit-kerja"}>
                <MenuItem>Daftar Induk Unit Kerja</MenuItem>
              </Link>
            </MenuList>
          </Menu>
          {isAuthenticated ? <Logout /> : <a href="/login">Login</a>}
        </HStack>
        {/* {JSON.stringify(user[0]?.unitKerja_profile?.indukUnitKerja.id)}
        {JSON.stringify(localStorage.getItem("token"))} */}
      </Container>
    </Box>
  );
}

export default Navbar;
