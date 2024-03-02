import * as d3 from 'd3';

const padding = 8;

const radii = [
    Math.round(160 / 2),
    Math.round(120 / 2),
    Math.round(88 / 2),
    Math.round(72 / 2),
];

export interface Options {
    width?: number;
    height?: number;
    padding?: number;
    maxRadius?: number;
    appendTo: string;
    nodes: INode[];
    listener: (nodes: CircleNode[], currentNode: CircleNode) => void;
}

export interface INode<T = any> {
    id?: number;
    text: string;
    priority: TPriority;
    selected: boolean;
    data?: T;
}

export interface CircleNode extends INode {
    radius: number;
    cx: number;
    cy: number;
    x: number;
    y: number;
}

const windowSize = window.innerWidth
const NodePriorities = {
    low: windowSize > 575 ? Math.round(72 / 2) : Math.round(72 / 3),
    medium: windowSize > 575 ? Math.round(88 / 2) : Math.round(88 / 3),
    high: windowSize > 575 ? Math.round(120 / 2) : Math.round(120 / 3),
    veryHigh: windowSize > 575 ? Math.round(160 / 2) : Math.round(160 / 3),
};

export function getRandomPriorityOrLength(name?: string): TPriority {
    const keys = Object.keys(NodePriorities);
    const randomNumber = Math.round(Math.random() * 4);
    let priority = 3;

    if (name?.length) {
        if (name.length >= 8) {
            priority = 2
        } else if (name.length >= 4) {
            priority = 1
        } else {
            priority = 0
        }
    }

    return keys[priority || randomNumber] as TPriority;
}

type TPriority = keyof typeof NodePriorities;

const getColour = (node: CircleNode) => (node.selected ? '#352466' : '#d7c9ff');
const getTextColour = (node: CircleNode) => (node.selected ? '#fff' : '#000')

export class D3CirclesWithGravityAndNoOverlap {
    width = 960;
    height = 700;
    padding = 10;
    maxRadius = 10;
    appendTo!: string;
    nodes!: CircleNode[];
    listener!: (nodes: CircleNode[], currentNode: CircleNode) => void;

    private rootSVG;
    private groups;
    private circle;
    private enterCircle: any;
    private simulation;

    constructor(options: Options) {
        for (const [key, val] of Object.entries(options)) {
            this[key] = val;
        }
    }

    setNodes(nodes) {
        this.nodes = nodes;
        return this;
    }

    initialize() {
        this.rootSVG?.remove();
        this.rootSVG = null
        this.generateNodes(this.nodes);
        this.appendRootSVGAndGroup(this.appendTo);
        return this;
    }

    start() {
        this.simulation = d3.forceSimulation(this.nodes)
            .force('charge', d3.forceManyBody().strength(-5))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('x', d3.forceX().x(function(d) {
                return 0;
            }))
            .force('y', d3.forceY().y(function(d) {
                return 0;
            }))
            .force('collision', d3.forceCollide().radius(function(d) {
                return d.radius + 5
            }))
            .on('tick', this.tick.bind(this));
    }

    generateNodes(nodes: INode[]) {
        this.nodes = nodes.map((node) => {
            const cx = this.width / 2 + Math.random() * 150 - 75;
            const cy = this.height / 2 + Math.random() * 150 - 75;
            return {
                radius: NodePriorities[node.priority],
                cx,
                cy,
                x: cx,
                y: cy,
                ...node,
            };
        });

        return this;
    }

    appendRootSVGAndGroup(appendTo: string): void {
        this.rootSVG = d3
            .select(appendTo)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        this.circle = this.rootSVG.selectAll('circle').data(this.nodes);
        const that = this;
        this.groups = this.circle
            .enter()
            .append('g')
            .attr('class', 'circle-group')
            .on('click', function (event, d: CircleNode) {
                d.selected = !d.selected;
                // @ts-ignore;
                d3.select(this).select('circle').attr('fill', getColour);
                // @ts-ignore;
                d3.select(this).select('p').style('color', getTextColour);
                that.listener(that.nodes, d);
            });
        this.enterCircle = this.groups
            .append('circle')
            .attr('class', 'node')
            .attr('fill', getColour);

        this.enterCircle
            .attr('r', function (d) {
                return d.radius;
            })
            .attr('cx', function (d) {
                return d.cx;
            })
            .attr('cy', function (d) {
                return d.cy;
            })
            .attr('class', 'circle-item')
        ;

        this.groups
            .append('foreignObject')
            .attr('dy', '.3em')
          .attr('x', function (d) {
            return d.x - d.radius + padding / 2;
          })
          .attr('y', function (d) {
            return d.y - d.radius + padding / 2;
          })
          .attr('width', (d) => (d.radius * 2) -padding)
          .attr('height', (d) => (d.radius * 2) -padding)
          .append('xhtml:div')
          .style('height', '100%')
          .style('width', '100%')
          .style('display', 'flex')
          .style('align-items', 'center')
          .style('justify-content', 'center')
          .style('text-align', 'center')
          .append('p')
          .style('color', getTextColour)
          .style('font-size', windowSize > 575 ? '16px' : '10px')
          .text(function (d) { return d.text})

    }

    tick(e) {
        d3
           .selectAll('circle')
           .data(this.nodes)
            .attr('r', function(d) {
                return d.radius
            })
            .attr('cx', function(d) {
                return d.x
            })
            .attr('cy', function(d) {
                return d.y
            })

        d3.selectAll('foreignObject')
            .attr('x', function (d) {
                return d.x - d.radius + padding / 2;
            })
            .attr('y', function (d) {
                return d.y - d.radius + padding / 2;
            })
    }


}


export const DummyNodes: INode<any>[] = [
    {
        priority: 'high',
        text: 'Football',
        id: 12,
        selected: false,
    },
    {
        priority: 'low',
        text: 'Pin Pon',
        id: 12,
        selected: true,
    },
    {
        priority: 'medium',
        text: 'Netflix',
        id: 12,
        selected: false,
    },
    {
        priority: 'veryHigh',
        text: 'Social Media',
        id: 12,
        selected: true,
    },
    {
        priority: 'veryHigh',
        text: 'Social Media',
        id: 12,
        selected: true,
    },
    {
        priority: 'veryHigh',
        text: 'Social Media',
        id: 12,
        selected: true,
    },
    {
        priority: 'veryHigh',
        text: 'Social Media',
        id: 12,
        selected: true,
    },
    {
        priority: 'medium',
        text: 'Netflix',
        id: 12,
        selected: false,
    },
    {
        priority: 'medium',
        text: 'Netflix',
        id: 12,
        selected: false,
    },
    {
        priority: 'medium',
        text: 'Netflix',
        id: 12,
        selected: false,
    },
];
