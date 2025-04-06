import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import {
    optimismSepolia
} from "wagmi/chains"

export const config = getDefaultConfig({
    appName: "Story Generator",
    chains: [optimismSepolia],
    projectId: "your_project_id", // Replace with your actual project ID
})