<script>
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "sveltestrap/src";
  import { clearAllCache } from "../db";
  import authStore from "../store/authStore";

  let isOpen = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  async function logOut() {
    authStore.set({ userId: undefined, fierbaseOn: true, isLogedIn: false });
    firebase.auth().signOut();
    clearAllCache();
  }

  function logIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      });
  }
</script>

<Navbar color="light" light expand="md">
  <NavbarBrand href="/">CoderBucks</NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ml-auto" navbar>
      <NavItem>
        <NavLink href="/store">Use CoderBucks</NavLink>
      </NavItem>
      <UncontrolledDropdown nav inNavbar>
        <DropdownToggle nav caret>Account</DropdownToggle>
        <DropdownMenu right>
          <DropdownItem>See my Account</DropdownItem>
          <DropdownItem>Change Password</DropdownItem>
          <DropdownItem divider />
          <DropdownItem href="/create_account">Create Account</DropdownItem>
          <DropdownItem divider />
          <DropdownItem on:click={logIn}>Login With Google</DropdownItem>
          <DropdownItem href="/loginWithEmail">Login With Email</DropdownItem>
          <DropdownItem on:click={logOut}>Logout</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </Nav>
  </Collapse>
</Navbar>
