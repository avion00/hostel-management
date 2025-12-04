import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import apis from "@/lib/api/api";
import { Plus } from "lucide-react";

const AddPropertyForm = ({ token, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    totalRooms: "",
    occupiedRooms: "",
    monthlyRevenue: "",
    rating: "",
    status: "active",
    image: "",
    amenities: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.location ||
      !formData.totalRooms ||
      !formData.occupiedRooms ||
      !formData.price
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const res = await axios.post(
        apis.addProperty,
        {
          ...formData,
          amenities: formData.amenities.split(",").map((a) => a.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res?.data?.message || "Property added successfully!");
      onSuccess(res.data.data);
      setFormData({
        name: "",
        location: "",
        totalRooms: "",
        occupiedRooms: "",
        monthlyRevenue: "",
        rating: "",
        status: "active",
        image: "",
        amenities: "",
        price: "",
      });
      setOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error adding property.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
          <Plus className="w-4 h-4 mr-2" /> Add Property
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>

        <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Total Rooms</Label>
              <Input
                name="totalRooms"
                type="number"
                value={formData.totalRooms}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Occupied Rooms</Label>
              <Input
                name="occupiedRooms"
                type="number"
                value={formData.occupiedRooms}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Monthly Revenue</Label>
              <Input
                name="monthlyRevenue"
                type="number"
                value={formData.monthlyRevenue}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Price</Label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Rating</Label>
            <Input
              name="rating"
              type="number"
              step="0.1"
              max="5"
              min="0"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Input
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="active / maintenance / pending"
            />
          </div>

          <div>
            <Label>Image URL</Label>
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Amenities (comma separated)</Label>
            <Input
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full bg-indigo-500">
            Add Property
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyForm;
