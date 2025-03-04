// import { ReactNode } from "react";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// interface EntityFormFieldProps {
//   control: any;
//   name: string;
//   label: string;
//   children: ReactNode;
// }

// export function EntityFormField({
//   control,
//   name,
//   label,
//   children,
// }: EntityFormFieldProps) {
//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem className="grid grid-cols-4 gap-4 items-center">
//           <FormLabel className="col-span-1">{label}</FormLabel>
//           <div className="col-span-3 space-y-2">
//             <FormControl>{children}</FormControl>
//             <FormMessage />
//           </div>
//         </FormItem>
//       )}
//     />
//   );
// }
