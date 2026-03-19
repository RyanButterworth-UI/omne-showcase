import { SideNav } from "@/components/nav/SideNav";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const usePathname = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

jest.mock("@heroicons/react/24/outline", () => {
  const MockIcon = ({ title }: { title?: string }) => (
    <svg aria-hidden="true" data-testid={title ?? "icon"} />
  );

  return {
    ArrowLeftOnRectangleIcon: MockIcon,
    Bars3Icon: MockIcon,
    CalendarIcon: MockIcon,
    ChartBarSquareIcon: MockIcon,
    ChevronDoubleLeftIcon: MockIcon,
    ChevronDoubleRightIcon: MockIcon,
    Cog6ToothIcon: MockIcon,
    CursorArrowRaysIcon: MockIcon,
    LifebuoyIcon: MockIcon,
    Squares2X2Icon: MockIcon,
    UserGroupIcon: MockIcon,
    XMarkIcon: MockIcon,
  };
});

describe("SideNav", () => {
  beforeEach(() => {
    usePathname.mockReturnValue("/dashboard");
  });

  it("renders expanded navigation by default", () => {
    render(<SideNav />);

    const sidebar = screen.getByLabelText(/primary sidebar navigation/i);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(sidebar).toHaveClass("flex-col");
    expect(
      screen.getByRole("button", { name: /open menu/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /collapse sidebar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tracking/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /audience/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /analytics & reports/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /help/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("does not mark dashboard as current on a different route", () => {
    usePathname.mockReturnValue("/login");

    render(<SideNav />);

    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).not.toHaveAttribute("aria-current");
  });

  it("opens and closes the mobile menu from the top bar", async () => {
    const user = userEvent.setup();

    render(<SideNav />);

    expect(
      screen.queryByRole("dialog", { name: /mobile menu/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /open menu/i }));

    expect(
      screen.getByRole("dialog", { name: /mobile menu/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /close menu/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close menu/i }));

    expect(
      screen.queryByRole("dialog", { name: /mobile menu/i }),
    ).not.toBeInTheDocument();
  });

  it("collapses to an icon rail while keeping accessible names", async () => {
    const user = userEvent.setup();

    render(<SideNav />);

    await user.click(screen.getByRole("button", { name: /collapse sidebar/i }));

    expect(
      screen.getByRole("button", { name: /expand sidebar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("General")).not.toBeInTheDocument();
    expect(screen.queryByText("Support")).not.toBeInTheDocument();
    expect(screen.queryByText("Analytics & Reports")).not.toBeInTheDocument();
    expect(screen.queryByText("Help")).not.toBeInTheDocument();
  });

  it("expands again after a second toggle", async () => {
    const user = userEvent.setup();

    render(<SideNav />);

    await user.click(screen.getByRole("button", { name: /collapse sidebar/i }));
    await user.click(screen.getByRole("button", { name: /expand sidebar/i }));

    expect(
      screen.getByRole("button", { name: /collapse sidebar/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });
});
