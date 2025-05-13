// src/components/ui/table.tsx
import * as React from "react"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={`w-full caption-bottom text-sm ${className}`}
        role="table"
        {...props}
      />
    </div>
  )
)
Table.displayName = "Table"

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={className} role="rowgroup" {...props} />
  )
)
TableHeader.displayName = "TableHeader"

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={className}
      role="rowgroup"
      {...props}
    />
  )
)
TableBody.displayName = "TableBody"

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={`border-b border-[var(--border-color)] transition-colors ${className}`}
      role="row"
      {...props}
    />
  )
)
TableRow.displayName = "TableRow"

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, scope = "col", ...props }, ref) => (
    <th
      ref={ref}
      className={`bg-[var(--primary-color)] text-white p-3 text-left align-middle font-medium ${className}`}
      scope={scope}
      role="columnheader"
      {...props}
    />
  )
)
TableHead.displayName = "TableHead"

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={`p-3 align-middle border-b border-[var(--border-color)] ${className}`}
      role="cell"
      {...props}
    />
  )
)
TableCell.displayName = "TableCell"

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children: React.ReactNode
}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={`mt-4 text-sm text-gray-500 ${className}`}
      {...props}
    />
  )
)
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}