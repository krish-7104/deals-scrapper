import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { AiOutlineDelete } from "react-icons/ai";
export type Trackers = {
  productUrl: string;
  price: number;
};

const getCompanyName = (link: string) => {
  if (link.includes("myntra")) return "/logos/myntra.png";
  if (link.includes("amazon")) return "/logos/amazon.png";
  if (link.includes("flipkart")) return "/logos/flipkart.png";
  if (link.includes("ajio")) return "/logos/ajio.png";
  if (link.includes("meesho")) return "/logos/meesho.png";
};

const deleteTrackerHandler = () => {
  try {
  } catch (error) {}
};

export const columns: ColumnDef<Trackers>[] = [
  {
    accessorKey: "id",
    header: () => <p className="text-center">Id</p>,
    cell: ({ row }) => {
      return <p className="text-center">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "price",
    header: () => <p className="text-center">Desired Price</p>,
    cell: ({ row }) => {
      return <p className="text-center">₹{row.getValue("price")}</p>;
    },
  },
  {
    accessorKey: "website",
    header: () => <p className="text-center">Website</p>,
    cell: ({ row }) => {
      const image =
        getCompanyName(row.getValue("productUrl")) || "/logos/amazon.png";
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image src={image} width={30} height={30} alt="company" />
        </div>
      );
    },
  },
  {
    accessorKey: "productUrl",
    header: () => <p className="text-center">View Product</p>,
    cell: ({ row }) => {
      const link: string = row.getValue("productUrl");
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            size={"sm"}
            onClick={() => window.open(link)}
            variant={"secondary"}
          >
            View Product
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "delete",
    header: () => <p className="text-center"></p>,
    cell: ({ row }) => {
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button size={"icon"} variant={"destructive"}>
            <AiOutlineDelete className="text-lg" />
          </Button>
        </div>
      );
    },
  },
];
