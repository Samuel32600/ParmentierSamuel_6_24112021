import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"

import { ROUTES } from "../constants/routes"
import Bills from "../containers/Bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html
      //to-do write expect expression
      const iconActive = screen.getByTestId("icon-window")
      expect(iconActive.classList.contains("active-icon")).toBeTruthy
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      // -----Bug report - Bills-----
      // dates.sort(antiChrono)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    //-------------------------------
    //-----test for Loading Page-----
    //-------------------------------
    test("Then control if loading page is correctly loaded", () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    })


    //-------------------------------
    //-----test for Error Page-------
    //-------------------------------
    test("Then, it should render ErrorPage", () => {
      const html = BillsUI({ error: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })

  //-----------------------------------
  //-----test for newbill button-------
  //-----------------------------------
  describe("when i click on newbill button", () => {
    test("A new bill page is open", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const newBills = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })

      const html = BillsUI({ data: [] })
      document.body.innerHTML = html
      const btnNewBill = screen.getByTestId("btn-new-bill")
      const handleClickNewBill = jest.fn(e => newBills.handleClickNewBill(e))
      btnNewBill.addEventListener("click", handleClickNewBill)
      fireEvent.click(btnNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
      const formNewBill = screen.getByTestId('form-new-bill')
      expect(formNewBill).toBeTruthy
    })
  })

  //--------------------------------------
  //-----test for click on icon Eye-------
  //--------------------------------------
  describe("When I click on icon eye", () => {
    test("The modal should be open", () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const newBills = new Bills({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })

      $.fn.modal = jest.fn()

      const iconEyeTest = screen.queryAllByTestId('icon-eye')
      const handelClickIconEye = jest.fn(e => newBills.handleClickIconEye)
      iconEyeTest[3].addEventListener("click", handelClickIconEye)
      fireEvent.click(iconEyeTest[3])
      expect(handelClickIconEye).toHaveBeenCalled()
      const modale = document.getElementById('modaleFile')
      expect(modale).toBeTruthy()
    })
  })
})


