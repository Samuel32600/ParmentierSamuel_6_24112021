import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"

import { ROUTES } from "../constants/routes"
import Bills from "../containers/Bills.js"



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html
      //to-do write expect expression
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

    //-------------------------------------
    //-----test for handleClickIconEye-----
    //-------------------------------------
    describe("When I click on the icon eye", () => {
      test("Then, preview should open", () => {
        
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const bill = new Bills({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage
        })
        $.fn.modal = jest.fn()
        const handleClickIconEye = jest.fn(() => bill.handleClickIconEye)
        const eye = screen.queryAllByTestId('icon-eye')
        eye[0].addEventListener("click", handleClickIconEye)
        fireEvent.click(eye[0])
        expect(handleClickIconEye).toHaveBeenCalled()
        const modale = screen.getByTestId("modaleFileEmployee")
        expect(modale).toBeTruthy()
      })
    })
    
  })
})


