import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DATE_FORMATS } from "@/lib/utils";

interface DatePickerWithInputProps {
  date: Date | null;
  setDate: (date: Date | undefined) => void;
  required?: boolean;
  "data-testid"?: string;
}

const DatePickerWithInput: React.FC<DatePickerWithInputProps> = ({
  date,
  setDate,
  required = false,
  "data-testid": testId,
}) => {
  const [inputValue, setInputValue] = useState(
    date ? format(date, DATE_FORMATS.US) : ""
  );

  useEffect(() => {
    setInputValue(date ? format(date, DATE_FORMATS.US) : "");
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const parsedDate = parse(newValue, "MM/dd/yyyy", new Date());
    console.log("DatePicker parsed date:", {
      input: newValue,
      parsed: parsedDate,
      isValid: isValid(parsedDate),
    });
    if (isValid(parsedDate)) {
      setDate(parsedDate);
    } else {
      setDate(undefined);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          data-testid={testId}
          value={inputValue}
          onChange={handleInputChange}
          placeholder={DATE_FORMATS.PLACEHOLDER}
          className="w-full bg-background"
        />
        {!required && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => {
              if (date) {
                setDate(undefined);
                setInputValue("");
              }
            }}
            disabled={!date}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="icon">
            <CalendarDays className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <DayPicker
            mode="single"
            selected={date || undefined}
            onSelect={(newDate) => {
              setDate(newDate);
              setInputValue(newDate ? format(newDate, "MM/dd/yyyy") : "");
            }}
            showOutsideDays
            captionLayout="dropdown"
            defaultMonth={date || new Date()}
            startMonth={new Date(new Date().getFullYear() - 100, 0)}
            endMonth={new Date(new Date().getFullYear() + 1, 11)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithInput;
