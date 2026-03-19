import { LoginScreen } from "@/components/auth/LoginScreen";
import { Providers } from "@/providers";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    push.mockReset();
    refresh.mockReset();
    global.fetch = jest.fn();
  });

  it("renders the login form fields", () => {
    render(
      <Providers>
        <LoginScreen />
      </Providers>,
    );

    expect(
      screen.getByRole("heading", { name: /sign in to your account/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /username/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /use username gregp/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /use username socialscientists/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /use username noamalper/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/vp of product/i)).toHaveLength(2);
    expect(
      screen.getAllByText(/westminster, maryland, united states/i),
    ).toHaveLength(2);
  });

  it("shows an error message when credentials are rejected", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    render(
      <Providers>
        <LoginScreen />
      </Providers>,
    );

    await user.clear(screen.getByRole("textbox", { name: /username/i }));
    await user.type(
      screen.getByRole("textbox", { name: /username/i }),
      "wrong",
    );
    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /invalid credentials/i,
    );
  });

  it("lets a different demo profile sign in successfully", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <Providers>
        <LoginScreen />
      </Providers>,
    );

    await user.click(
      screen.getByRole("button", { name: /use username noamalper/i }),
    );
    await user.type(screen.getByLabelText(/password/i), "1omneDemo#2026");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: "noamalper",
          password: "1omneDemo#2026",
          rememberMe: true,
        }),
      });
      expect(push).toHaveBeenCalledWith("/dashboard");
      expect(refresh).toHaveBeenCalled();
    });
  });

  it("updates the selected profile details when a username pill is chosen", async () => {
    const user = userEvent.setup();

    render(
      <Providers>
        <LoginScreen />
      </Providers>,
    );

    await user.click(
      screen.getByRole("button", { name: /use username noamalper/i }),
    );

    expect(
      screen.getByText(/chief technology officer at omnesoft/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/yeshiva university/i)).toBeInTheDocument();
  });
});
