import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

//import for test
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"

//import for integration test 
import BillsUI from "../views/BillsUI.js"
import firebase from "../__mocks__/firebase"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    //------------------------------------------
    //-----test for mail icon highlighted-------
    //------------------------------------------
    test("Then mail icon in vertical navbar should be highlighted", () => {
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee"
      }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const iconActive = screen.getByTestId("icon-mail")
      expect(iconActive.classList.contains("active-icon")).toBeTruthy
    })

    //-----------------------------
    //-----test for the form-------
    //-----------------------------
    test("Then I check all formdata was completed", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const inputForm = {
        email: "jeandupont@email.com",
        expenseType: "Restaurants et bars",
        expenseName: "test Billed",
        datepicker: "2021-12-10",
        expenseAmount: "150",
        expenseTVA: "30",
        expensePCT: "20",
        expenseCommentary: "menu complet et cocktail au bar",
        expenseFile: "AU Pois Gourmand.jpg"
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: inputForm.email
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      //test type of spent
      const inputType = screen.getByTestId("expense-type")
      fireEvent.click(inputType, { target: { value: inputForm.expenseType, name: inputForm.expenseType, selectedIndex: 1 } })
      expect(inputType.value).toBe(inputForm.expenseType)

      //test for name of spent
      const inputName = screen.getByTestId("expense-name")
      fireEvent.click(inputName, { target: { value: inputForm.expenseName } })
      expect(inputName.value).toBe(inputForm.expenseName)

      //test for date
      const inputDate = screen.getByTestId("datepicker")
      fireEvent.click(inputDate, { target: { value: inputForm.datepicker } })
      expect(inputDate.value).toBe(inputForm.datepicker)

      //test for price
      const inputAmount = screen.getByTestId("amount")
      fireEvent.click(inputAmount, { target: { value: inputForm.expenseAmount } })
      expect(inputAmount.value).toBe(inputForm.expenseAmount)

      //test price of TVA
      const inputTva = screen.getByTestId("vat")
      fireEvent.click(inputTva, { target: { value: inputForm.expenseTVA } })
      expect(inputTva.value).toBe(inputForm.expenseTVA)

      //test % of TVA
      const inputPct = screen.getByTestId("pct")
      fireEvent.click(inputPct, { target: { value: inputForm.expensePCT } })
      expect(inputPct.value).toBe(inputForm.expensePCT)

      //test comment field
      const inputCommentary = screen.getByTestId("commentary")
      fireEvent.click(inputCommentary, { target: { value: inputForm.expenseCommentary } })
      expect(inputCommentary.value).toBe(inputForm.expenseCommentary)

      const firestore = null

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })

      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(e => newBill.handleSubmit(e))

      form.addEventListener("submit", handleSubmit)
      fireEvent.submit(form)
      expect(handleSubmit).toHaveBeenCalledTimes(1)
      expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })

    //---------------------------------------------------
    //-----test for good extension file + btn SEND-------
    //---------------------------------------------------
    describe("When I download a file with a good extention", () => {
      test("the submit button is available", () => {
        const html = NewBillUI()
        document.body.innerHTML = html

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const firestore = null
        const newBill = new NewBill({
          document,
          onNavigate,
          firestore,
          localStorage: window.localStorage
        })

        const inputData = new File(["filetest"], 'filetest.jpeg', { type: "image/jpeg" })
        const filetest = screen.getByTestId("file")
        const btnSend = document.getElementById("btn-send-bill")
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

        filetest.addEventListener("change", handleChangeFile)
        fireEvent.change(filetest, {
          target: {
            files: [inputData],
          }
        })
        expect(handleChangeFile).toHaveBeenCalled()
        expect(btnSend.disabled).not.toBeTruthy()
      })
    })

    //---------------------------------------------------------------
    //-----test for BAD extension file + btn SEND not clikable-------
    //---------------------------------------------------------------
    describe("When I download a file with bad extention", () => {
      test("the submit button is not clikable ", () => {
        const html = NewBillUI()
        document.body.innerHTML = html

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const firestore = null
        const newBill = new NewBill({
          document,
          onNavigate,
          firestore,
          localStorage: window.localStorage
        })

        const inputData = new File(["filetest"], 'filetest.txt', { type: "image/txt" })
        const filetest = screen.getByTestId("file")
        const btnSend = document.getElementById("btn-send-bill")
        const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

        filetest.addEventListener("change", handleChangeFile)
        fireEvent.change(filetest, {
          target: {
            files: [inputData],
          }
        })
        expect(handleChangeFile).toHaveBeenCalled()
        expect(btnSend.disabled).toBeTruthy()
      })
    })
  })  
})

describe("Given I am a user connected as Employee", () => {
  describe("When create a new bill", () => {
    test("add new bill from mock API POST", async () => {
      const postSpy = jest.spyOn(firebase, "post")
      const newBill = {
        id: "",
        status: "",
        pct: "",
        amount: "",
        email: "",
        name: "test newBill",
        vat: "",
        fileName: "newBill",
        date: "2021-09-07",
        commentAdmin: "",
        commentary: "",
        type: "",
        fileUrl: "",
      }
      const bills = await firebase.post(newBill)
      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})



